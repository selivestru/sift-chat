import {
  AuthenticationRegistry,
  OidcAccountResolver,
  type OAuthTokens,
  type OidcProfile,
  type OidcResolveContext,
} from '@nestjs/authentication'
import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common'

import { safeUser } from '~/common/utils/safe-user.js'
import { OAuthProvider } from '~/generated/prisma/enums.js'

import { UsersService } from '../users/users.service.js'
import { SafeUser } from '../users/users.types.js'

@Injectable()
export class AccountLinker extends OidcAccountResolver {
  constructor(
    private readonly userService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super()
    registry.registerHandler('oidc', this)
  }

  async resolveUser(
    profile: OidcProfile,
    _tokens: OAuthTokens,
    { linkTo }: OidcResolveContext,
  ): Promise<SafeUser | null> {
    const provider = this.resolveProvider(profile.provider)

    if (!provider) {
      return null
    }

    const linked = await this.userService.findByIdentity(provider, profile.subject)

    if (linkTo) {
      if (linked && linked.id !== linkTo.id) {
        throw new ConflictException('This Google account belongs to another customer')
      }

      const user = await this.userService.linkIdentity(linkTo.id, provider, profile.subject)
      return safeUser(user)
    }

    if (linked) {
      return safeUser(linked)
    }

    if (!profile.email || !profile.emailVerified) {
      return null
    }

    const existing = await this.userService.findByEmail(profile.email)

    if (!existing) {
      const user = await this.userService.create({
        email: profile.email,
        emailVerified: true,
        accounts: {
          create: {
            provider,
            providerAccountId: profile.subject,
          },
        },
      })

      return safeUser(user)
    }

    if (!existing.emailVerified) {
      throw new ForbiddenException(
        'Sign in with your password, then connect Google from your account',
      )
    }

    const user = await this.userService.linkIdentity(existing.id, provider, profile.subject)

    return safeUser(user)
  }

  private resolveProvider(provider: string): OAuthProvider | null {
    switch (provider) {
      case 'google':
        return OAuthProvider.GOOGLE
      default:
        return null
    }
  }
}
