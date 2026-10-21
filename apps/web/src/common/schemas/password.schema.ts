import z from 'zod'

export const passwordSchema = z
  .string()
  .normalize('NFKC')
  .min(15, { error: 'Password must contain at least 15 characters' })
  .max(128, { error: 'Password must contain at most 128 characters' })
  .refine((password) => /\S/u.test(password), {
    error: 'Password must not contain only whitespace',
  })
