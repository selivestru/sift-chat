import { describe, expect, it } from 'vitest'

import { passwordSchema } from './password.schema.js'

describe('passwordSchema', () => {
  it('accepts passphrases without requiring digits or special characters', () => {
    const password = 'correct horse battery staple'

    expect(passwordSchema.parse(password)).toBe(password)
  })

  it('preserves leading and trailing spaces', () => {
    const password = '  a long passphrase  '

    expect(passwordSchema.parse(password)).toBe(password)
  })

  it('preserves case', () => {
    const password = 'A Long Passphrase'

    expect(passwordSchema.parse(password)).toBe(password)
  })

  it('normalizes Unicode with NFKC', () => {
    expect(passwordSchema.parse('ａ'.repeat(15))).toBe('a'.repeat(15))
    expect(passwordSchema.parse('e\u0301'.repeat(15))).toBe('é'.repeat(15))
  })

  it('checks length after normalization', () => {
    expect(passwordSchema.safeParse('e\u0301'.repeat(14)).success).toBe(false)
    expect(passwordSchema.safeParse('e\u0301'.repeat(15)).success).toBe(true)
  })

  it.each(['a', '😀'])('accepts 15–128 Unicode code points using %s', (character) => {
    expect(passwordSchema.safeParse(character.repeat(14)).success).toBe(false)
    expect(passwordSchema.safeParse(character.repeat(15)).success).toBe(true)
    expect(passwordSchema.safeParse(character.repeat(128)).success).toBe(true)
    expect(passwordSchema.safeParse(character.repeat(129)).success).toBe(false)
  })

  it.each([
    '',
    ' '.repeat(15),
    '\t'.repeat(15),
    '\n'.repeat(15),
    '\u3000'.repeat(15),
    null,
    undefined,
    123,
  ])('rejects empty, whitespace-only, or non-string input: %j', (input) => {
    expect(passwordSchema.safeParse(input).success).toBe(false)
  })
})
