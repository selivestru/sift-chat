import z from 'zod'

const userSchema = z.object({
  id: z.uuidv7(),
  email: z.email(),
  createdAt: z.iso.datetime(),
})

export const compiledUserSchema = z.compile(userSchema)

export type User = z.infer<typeof userSchema>
