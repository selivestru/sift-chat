import { User } from '~/generated/prisma/client.js'

type PublicUserFields = Pick<User, 'id' | 'email' | 'createdAt'>

export type SafeUser = PublicUserFields & {
  [K in Exclude<keyof User, keyof PublicUserFields>]?: never
}
