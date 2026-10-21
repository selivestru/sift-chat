import { Module } from '@nestjs/common'

import { PrismaModule } from '~/infrastructure/prisma/prisma.module.js'
import { RedisModule } from '~/infrastructure/redis/redis.module.js'

import { UsersModule } from '../users/users.module.js'
import { AccountLinker } from './account-linker.js'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { OidcController } from './oidc.controller.js'
import { RedisSessionStore } from './redis-session.store.js'
import { SessionAuth } from './session-auth.provider.js'

@Module({
  imports: [PrismaModule, UsersModule, RedisModule],
  controllers: [AuthController, OidcController],
  providers: [AuthService, RedisSessionStore, SessionAuth, AccountLinker],
})
export class AuthModule {}
