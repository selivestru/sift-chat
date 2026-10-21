import { describe, expect, it } from 'vitest'

import { emailSchema } from './email.schema.js'

describe('emailSchema', () => {
  it('normalizes whitespace and case without removing dots or plus tags', () => {
    expect(emailSchema.parse('  First.Last+Tag@EXAMPLE.COM  ')).toBe('first.last+tag@example.com')
  })

  it.each(['', '   ', 'invalid', 'a@@example.com', 'a b@example.com', null, undefined, 123])(
    'rejects invalid input: %j',
    (input) => {
      expect(emailSchema.safeParse(input).success).toBe(false)
    },
  )

  it('limits the local part to 64 characters', () => {
    expect(emailSchema.safeParse(`${'a'.repeat(64)}@example.com`).success).toBe(true)
    expect(emailSchema.safeParse(`${'a'.repeat(65)}@example.com`).success).toBe(false)
  })

  it('limits the entire address to 254 characters', () => {
    const domain = `${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`
    const address = `${'a'.repeat(64)}@${domain}`

    expect(address.length).toBe(254)
    expect(emailSchema.safeParse(address).success).toBe(true)
    expect(emailSchema.safeParse(address.replace('.com', 'd.com')).success).toBe(false)
  })
})
