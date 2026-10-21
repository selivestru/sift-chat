import { queryOptions } from '@tanstack/react-query'
import { isHTTPError } from 'ky'

import { compiledUserSchema } from '~/modules/User'

import { api } from '../api/api'

export const currentUserOptions = queryOptions({
  queryKey: ['current-user'],
  queryFn: async ({ signal }) => {
    try {
      const data = await api.get('/users/me', { signal }).json<unknown>()

      return compiledUserSchema.parse(data)
    } catch (error) {
      if (isHTTPError(error) && error.response.status === 401) {
        return null
      }

      throw error
    }
  },
  staleTime: 60_000,
})
