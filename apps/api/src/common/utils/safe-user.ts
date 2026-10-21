import { User } from '~/generated/prisma/client.js'
import { SafeUser } from '~/modules/users/users.types.js'

import { pick } from './pick.js'

export const safeUser = (user: User): SafeUser => {
  return pick(user, ['id', 'email', 'createdAt'])
}
