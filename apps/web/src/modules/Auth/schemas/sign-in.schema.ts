import z from 'zod'

import { emailSchema } from '~/common/schemas/email.schema'
import { passwordSchema } from '~/common/schemas/password.schema'

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInInput = z.infer<typeof signInSchema>

export const compiledSignInSchema = z.compile(signInSchema)
