import z from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z
      .email({ error: 'Invalid email address' })
      .max(254, { error: 'Email must contain at most 254 characters' })
      .refine((email) => email.split('@')[0].length <= 64, {
        error: 'Email local part must contain at most 64 characters',
      }),
  )
