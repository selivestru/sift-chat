import { PasswordHasher } from '@nestjs/authentication'
import { HttpException, Injectable } from '@nestjs/common'

import { safeUser } from '~/common/utils/safe-user.js'

import { UsersService } from '../users/users.service.js'
import { SafeUser } from '../users/users.types.js'
import { SignInInput } from './dto/sign-in.schema.js'
import { SignUpInput } from './dto/sign-up.schema.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async signUp(body: SignUpInput): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(body.email)

    if (user) {
      throw new HttpException('User with this email already exists', 409, {
        errorCode: 'USER_ALREADY_EXISTS',
      })
    }

    const hashedPassword = await this.passwordHasher.hash(body.password)

    const newUser = await this.usersService.create({
      email: body.email,
      password: hashedPassword,
      emailVerified: true, // TODO: Implement email verification
    })

    return safeUser(newUser)
  }

  async signIn(body: SignInInput): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(body.email)

    const isValid = await this.passwordHasher.verify(body.password, user?.password)

    if (!user || !isValid) {
      throw new HttpException('Invalid email or password', 401, {
        errorCode: 'INVALID_CREDENTIALS',
      })
    }

    return safeUser(user)
  }
}
