import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '~/common/api/api'
import { currentUserOptions } from '~/common/constants/currentUserOptions'
import { compiledUserSchema, type User } from '~/modules/User'

import type { SignUpInput } from '../schemas/sign-up.schema'

export const useSignUpMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-up'],
    mutationFn: async (body: SignUpInput) => {
      const data = await api.post('/auth/sign-up', { json: body }).json<User>()
      return compiledUserSchema.parse(data)
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(currentUserOptions.queryKey, data)
    },
  })
}
