import { describe, expect, it } from 'vitest'

import { compiledSignInSchema, signInSchema } from './sign-in.schema.js'
import { compiledSignUpSchema, signUpSchema } from './sign-up.schema.js'

describe.each([
  ['sign-in', signInSchema, compiledSignInSchema],
  ['sign-up', signUpSchema, compiledSignUpSchema],
] as const)('%s schemas', (_name, schema, compiledSchema) => {
  const input = {
    email: '  User@Example.COM  ',
    password: 'ａ'.repeat(15),
    confirmPassword: 'a'.repeat(15),
  }

  it('normalizes email and password', () => {
    const result = schema.parse(input)

    expect(result.email).toBe('user@example.com')
    expect(result.password).toBe('a'.repeat(15))
  })

  it('rejects invalid email and weak passwords', () => {
    expect(schema.safeParse({ ...input, email: 'invalid' }).success).toBe(false)
    expect(schema.safeParse({ ...input, password: 'short' }).success).toBe(false)
  })

  it('preserves validation and normalization when compiled', () => {
    expect(compiledSchema.parse(input)).toEqual(schema.parse(input))
    expect(compiledSchema.safeParse({ ...input, password: 'short' }).success).toBe(false)
    expect(compiledSchema.safeParse({ ...input, email: 'invalid' }).success).toBe(false)
  })
})

describe('sign-up password confirmation', () => {
  it.each([signUpSchema, compiledSignUpSchema])('rejects mismatched passwords', (schema) => {
    const result = schema.safeParse({
      email: 'user@example.com',
      password: 'correct horse battery staple',
      confirmPassword: 'another long passphrase',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['confirmPassword'], message: 'Passwords do not match' }),
        ]),
      )
    }
  })
})
