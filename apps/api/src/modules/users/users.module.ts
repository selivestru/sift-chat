import { Module } from '@nestjs/common'

import { PrismaModule } from '~/infrastructure/prisma/prisma.module.js'

import { UsersController } from './users.controller.js'
import { UsersRepository } from './users.repository.js'
import { UsersService } from './users.service.js'

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
