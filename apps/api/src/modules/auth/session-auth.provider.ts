import {
  AuthenticationRegistry,
  SessionCookieProvider,
  type SessionRecord,
} from '@nestjs/authentication'
import { Injectable } from '@nestjs/common'

import { safeUser } from '~/common/utils/safe-user.js'

import { UsersService } from '../users/users.service.js'
import { SafeUser } from '../users/users.types.js'

@Injectable()
export class SessionAuth extends SessionCookieProvider<SafeUser> {
  constructor(
    private readonly userService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super()
    registry.registerProvider(this)
  }

  async validate(session: SessionRecord) {
    const user = await this.userService.findById(session.userId)
    return user ? safeUser(user) : null
  }
}
