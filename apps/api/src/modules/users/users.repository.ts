import { Injectable } from '@nestjs/common'

import { OAuthProvider, User } from '~/generated/prisma/client.js'
import { UserCreateInput } from '~/generated/prisma/models.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data })
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    })
  }

  async findByIdentity(provider: OAuthProvider, providerAccountId: string): Promise<User | null> {
    const account = await this.prismaService.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    })

    return account?.user ?? null
  }

  linkIdentity(userId: string, provider: OAuthProvider, providerAccountId: string) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        accounts: {
          create: {
            provider,
            providerAccountId,
          },
        },
      },
    })
  }
}
