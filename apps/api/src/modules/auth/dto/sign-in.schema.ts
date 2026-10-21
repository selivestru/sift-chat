import z from 'zod'

import { emailSchema } from '~/common/schemas/email.schema.js'
import { passwordSchema } from '~/common/schemas/password.schema.js'

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInInput = z.infer<typeof signInSchema>

export const compiledSignInSchema = z.compile(signInSchema)
