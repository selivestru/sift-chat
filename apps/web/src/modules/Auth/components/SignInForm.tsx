import { Alert, Button, Card, FieldError, Input, Label, Spinner, TextField } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { Controller } from 'react-hook-form'

import { Show } from '~/common/ui/Show'

import { useSignInForm } from '../hooks/useSignInForm'
import { PasswordInput } from './PasswordInput'

export const SignInForm = () => {
  const { form, isLoading, serverError, onSubmit } = useSignInForm()

  return (
    <Card className="h-full w-full sm:h-auto sm:max-w-md">
      <Card.Header>
        <Card.Title>Sign In</Card.Title>
        <Card.Description>
          Enter your email and password to sign in to your account.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {serverError && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to sign in</Alert.Title>
              <Alert.Description>{serverError}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <form
          id="sign-in-form"
          aria-busy={isLoading}
          onSubmit={onSubmit}
          className={cn(isLoading && 'pointer-events-none')}
        >
          <fieldset disabled={isLoading} className="space-y-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField isInvalid={fieldState.invalid}>
                  <Label htmlFor="sign-in-email-input">Email</Label>
                  <Input
                    {...field}
                    id="sign-in-email-input"
                    variant="secondary"
                    type="email"
                    inputMode="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </TextField>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField isInvalid={fieldState.invalid}>
                  <Label htmlFor="sign-in-password-input">Password</Label>
                  <PasswordInput
                    {...field}
                    id="sign-in-password-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </TextField>
              )}
            />
          </fieldset>
        </form>
      </Card.Content>
      <Card.Footer className="flex-col gap-2.5">
        <Button fullWidth type="submit" form="sign-in-form" isPending={isLoading}>
          {({ isPending }) => (
            <>
              <Show when={isPending}>
                <Spinner color="current" />
              </Show>
              {isPending ? 'Signing in...' : 'Sign In'}
            </>
          )}
        </Button>
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Link to="/auth/sign-up" className="text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </Card.Footer>
    </Card>
  )
}
