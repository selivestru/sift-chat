import { OidcService, Public, SignInService } from '@nestjs/authentication'
import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service.js'
import { compiledSignInSchema, type SignInInput } from './dto/sign-in.schema.js'
import { compiledSignUpSchema, type SignUpInput } from './dto/sign-up.schema.js'

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly signInService: SignInService,
    private readonly oidcService: OidcService,
  ) {}

  @Post('sign-up')
  async signUp(@Body({ schema: compiledSignUpSchema }) body: SignUpInput) {
    const user = await this.authService.signUp(body)
    await this.signInService.signIn(user.id, { method: 'password' })
    return user
  }

  @Post('sign-in')
  async signIn(@Body({ schema: compiledSignInSchema }) body: SignInInput) {
    const user = await this.authService.signIn(body)
    await this.signInService.signIn(user.id, { method: 'password' })
    return user
  }
}
