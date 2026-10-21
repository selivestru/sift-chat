import {
  AuthenticationStorage,
  type SessionRecord,
  type SessionStore,
} from '@nestjs/authentication'
import { Injectable } from '@nestjs/common'

import { RedisService } from '~/infrastructure/redis/redis.service.js'

@Injectable()
export class RedisSessionStore implements SessionStore {
  constructor(
    private readonly redis: RedisService,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({
      sessions: this,
    })
  }

  private sessionKey(id: string): string {
    return `auth:session:${id}`
  }

  private userKey(userId: string): string {
    return `auth:user:${userId}:sessions`
  }

  async getSession(id: string): Promise<SessionRecord | undefined> {
    const data = await this.redis.get(this.sessionKey(id))

    if (!data) return undefined

    const record = JSON.parse(data) as SessionRecord

    return {
      ...record,
      createdAt: new Date(record.createdAt),
      lastActiveAt: new Date(record.lastActiveAt),
      expiresAt: new Date(record.expiresAt),
    }
  }

  async createSession(record: SessionRecord): Promise<void> {
    const ttl = Math.ceil((record.expiresAt.getTime() - Date.now()) / 1000)

    if (ttl <= 0) {
      throw new Error('Session already expired')
    }

    await this.redis
      .multi()
      .set(this.sessionKey(record.id), JSON.stringify(record), 'EX', ttl)
      .sadd(this.userKey(record.userId), record.id)
      .exec()
  }

  async touchSession(id: string, lastActiveAt: Date): Promise<void> {
    const script = `
      local value = redis.call('GET', KEYS[1])
      if not value then return 0 end

      local session = cjson.decode(value)
      local current = session.lastActiveAt

      if current and current >= ARGV[1] then
        return 0
      end

      session.lastActiveAt = ARGV[1]
      redis.call(
        'SET', KEYS[1], cjson.encode(session), 'KEEPTTL'
      )
      return 1
    `

    await this.redis.eval(script, 1, this.sessionKey(id), lastActiveAt.toISOString())
  }

  async deleteSession(id: string): Promise<boolean> {
    const session = await this.getSession(id)

    if (!session) return false

    const deleted = await this.redis.eval(
      `
      local deleted = redis.call('DEL', KEYS[1])
      if deleted == 1 then
        redis.call('SREM', KEYS[2], ARGV[1])
      end
      return deleted
      `,
      2,
      this.sessionKey(id),
      this.userKey(session.userId),
      id,
    )

    return deleted === 1
  }

  async listUserSessions(userId: string): Promise<SessionRecord[]> {
    const ids = await this.redis.smembers(this.userKey(userId))

    const sessions = await Promise.all(ids.map((id) => this.getSession(id)))

    return sessions.filter(
      (session): session is SessionRecord => session !== undefined && session.userId === userId,
    )
  }

  async deleteUserSessions(userId: string): Promise<void> {
    const ids = await this.redis.smembers(this.userKey(userId))

    if (ids.length === 0) return

    const keys = ids.map((id) => this.sessionKey(id))

    await this.redis.multi().del(keys).del(this.userKey(userId)).exec()
  }
}
