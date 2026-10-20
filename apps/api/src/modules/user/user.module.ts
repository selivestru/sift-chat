import { Module } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'
import { UserController } from './user.controller.js'
import { UserService } from './user.service.js'

@Module({
  imports: [PrismaService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
