import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api/getApiError'
import { getRequestErrorMessage } from '~/common/api/getRequestErrorMessage'

import { compiledSignInSchema, type SignInInput } from '../schemas/sign-in.schema'
import { useSignInMutation } from './useSignInMutation'

export const useSignInForm = () => {
  const signInMutation = useSignInMutation()
  const router = useRouter()

  const form = useForm<SignInInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(compiledSignInSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await signInMutation.mutateAsync(data)
    } catch (error) {
      const apiError = getApiError(error)

      const message =
        apiError?.errorCode === 'INVALID_CREDENTIALS'
          ? 'Invalid email or password'
          : getRequestErrorMessage(error, 'Unable to sign in. Please try again')

      form.setError('root.server', {
        type: 'server',
        message,
      })

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
