import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '~/common/api/api'
import { currentUserOptions } from '~/common/constants/currentUserOptions'
import { compiledUserSchema, type User } from '~/modules/User'

import type { SignInInput } from '../schemas/sign-in.schema'

export const useSignInMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async (body: SignInInput) => {
      const data = await api.post('/auth/sign-in', { json: body }).json<User>()
      return compiledUserSchema.parse(data)
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(currentUserOptions.queryKey, data)
    },
  })
}
