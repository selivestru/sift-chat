import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { AuthService } from './auth.service.js'
import { SessionAuth } from './session-auth.provider.js'

@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionAuth],
})
export class AuthModule {}
