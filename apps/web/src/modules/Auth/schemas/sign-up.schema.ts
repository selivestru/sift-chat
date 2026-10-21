import z from 'zod'

import { emailSchema } from '~/common/schemas/email.schema'
import { passwordSchema } from '~/common/schemas/password.schema'

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

export const compiledSignUpSchema = z.compile(signUpSchema)
