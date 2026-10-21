import { Injectable } from '@nestjs/common'

import { OAuthProvider, User } from '~/generated/prisma/client.js'
import { UserCreateInput } from '~/generated/prisma/models.js'

import { UsersRepository } from './users.repository.js'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(data: UserCreateInput): Promise<User> {
    return this.usersRepository.create(data)
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id)
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email)
  }

  findByIdentity(provider: OAuthProvider, providerAccountId: string): Promise<User | null> {
    return this.usersRepository.findByIdentity(provider, providerAccountId)
  }

  linkIdentity(userId: string, provider: OAuthProvider, providerAccountId: string): Promise<User> {
    return this.usersRepository.linkIdentity(userId, provider, providerAccountId)
  }
}
