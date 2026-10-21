import z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  ORIGIN: z.url(),
  APP_URL: z.url(),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>
