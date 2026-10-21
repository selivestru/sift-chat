import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { Controller } from 'react-hook-form'
import { CircleInfo } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/common/ui/Card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/common/ui/Field'
import { Input } from '~/common/ui/Input'

import { useSignUpForm } from '../hooks/useSignUpForm'
import { PasswordInput } from './PasswordInput'

export const SignUpForm = () => {
  const { form, isLoading, serverError, onSubmit } = useSignUpForm()

  return (
    <Card className="h-full w-full sm:h-auto sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your email and create a password to get started.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {serverError && (
          <Alert variant="destructive">
            <CircleInfo />
            <AlertTitle>Failed to sign up</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form
          id="sign-up-form"
          aria-busy={isLoading}
          onSubmit={onSubmit}
          className={cn(isLoading && 'pointer-events-none')}
        >
          <fieldset disabled={isLoading}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-email-input">Email</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-email-input"
                      type="email"
                      inputMode="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-password-input">Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id="sign-up-password-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="new-password"
                      autoCapitalize="none"
                      spellCheck={false}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>Use 15–128 characters.</FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-confirm-password-input">
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="sign-up-confirm-password-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      autoCapitalize="none"
                      spellCheck={false}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2.5">
        <Button fullWidth type="submit" form="sign-up-form" isLoading={isLoading}>
          Create account
        </Button>
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
