import {
  Alert,
  Button,
  Card,
  Description,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { Controller } from 'react-hook-form'

import { Show } from '~/common/ui/Show'

import { useSignUpForm } from '../hooks/useSignUpForm'
import { PasswordInput } from './PasswordInput'

export const SignUpForm = () => {
  const { form, isLoading, serverError, onSubmit } = useSignUpForm()

  return (
    <Card className="h-full w-full sm:h-auto sm:max-w-md">
      <Card.Header>
        <Card.Title>Sign Up</Card.Title>
        <Card.Description>Enter your email and create a password to get started.</Card.Description>
      </Card.Header>
      <Card.Content>
        {serverError && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to sign up</Alert.Title>
              <Alert.Description>{serverError}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <form
          id="sign-up-form"
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
                  <Label htmlFor="sign-up-email-input">Email</Label>
                  <Input
                    {...field}
                    id="sign-up-email-input"
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
                  <Label htmlFor="sign-up-password-input">Password</Label>
                  <PasswordInput
                    {...field}
                    id="sign-up-password-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                  {fieldState.error ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : (
                    <Description>Use 15–128 characters.</Description>
                  )}
                </TextField>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField isInvalid={fieldState.invalid}>
                  <Label htmlFor="sign-up-confirm-password-input">Confirm Password</Label>
                  <PasswordInput
                    {...field}
                    id="sign-up-confirm-password-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
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
        <Button fullWidth type="submit" form="sign-up-form" isPending={isLoading}>
          {({ isPending }) => (
            <>
              <Show when={isPending}>
                <Spinner color="current" />
              </Show>
              {isPending ? 'Signing up...' : 'Create account'}
            </>
          )}
        </Button>
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </Card.Footer>
    </Card>
  )
}
