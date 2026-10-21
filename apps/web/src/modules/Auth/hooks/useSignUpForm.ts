import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api/getApiError'
import { getRequestErrorMessage } from '~/common/api/getRequestErrorMessage'

import { compiledSignUpSchema, type SignUpInput } from '../schemas/sign-up.schema'
import { useSignUpMutation } from './useSignUpMutation'

export const useSignUpForm = () => {
  const signUpMutation = useSignUpMutation()
  const router = useRouter()

  const form = useForm<SignUpInput>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(compiledSignUpSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await signUpMutation.mutateAsync(data)
    } catch (error) {
      const apiError = getApiError(error)

      switch (apiError?.errorCode) {
        case 'USER_ALREADY_EXISTS':
          form.setError('email', {
            type: 'server',
            message: 'This email is already registered. Try signing in',
          })
          return

        case 'RESOURCE_ALREADY_EXISTS':
          form.setError('root.server', {
            type: 'server',
            message: 'Unable to create the account due to a data conflict',
          })
          return

        default:
          form.setError('root.server', {
            type: 'server',
            message: getRequestErrorMessage(
              error,
              'Unable to create the account. Please try again',
            ),
          })
      }

      return
    }

    await router.invalidate({ sync: true })
  })

  return {
    form,
    onSubmit,
    isLoading: form.formState.isSubmitting,
    serverError: form.formState.errors.root?.server?.message,
  }
}
