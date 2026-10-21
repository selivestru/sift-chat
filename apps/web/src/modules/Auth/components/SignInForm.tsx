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
import { Field, FieldError, FieldGroup, FieldLabel } from '~/common/ui/Field'
import { Input } from '~/common/ui/Input'

import { useSignInForm } from '../hooks/useSignInForm'
import { PasswordInput } from './PasswordInput'

export const SignInForm = () => {
  const { form, isLoading, serverError, onSubmit } = useSignInForm()

  return (
    <Card className="h-full w-full sm:h-auto sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your email and password to sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {serverError && (
          <Alert variant="destructive">
            <CircleInfo />
            <AlertTitle>Failed to sign in</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form
          id="sign-in-form"
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
                    <FieldLabel htmlFor="sign-in-email-input">Email</FieldLabel>
                    <Input
                      {...field}
                      id="sign-in-email-input"
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
                    <FieldLabel htmlFor="sign-in-password-input">Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id="sign-in-password-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="current-password"
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
        <Button fullWidth type="submit" form="sign-in-form" isLoading={isLoading}>
          Sign In
        </Button>
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Link to="/auth/sign-up" className="text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
