import { CurrentUser } from '@nestjs/authentication'
import { Controller, Get } from '@nestjs/common'

import { type User } from '~/generated/prisma/client.js'

import { UsersService } from './users.service.js'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: User) {
    return user
  }
}
