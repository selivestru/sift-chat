import { Button, InputGroup, type InputGroupInputProps } from '@heroui/react'
import { useState } from 'react'
import { Eye, EyeOff } from 'reicon-react'

export type PasswordInputProps = InputGroupInputProps

export const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const Icon = isVisible ? Eye : EyeOff

  return (
    <InputGroup fullWidth variant="secondary">
      <InputGroup.Input
        autoCapitalize="none"
        spellCheck={false}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />
      <InputGroup.Suffix className="pe-0">
        <Button
          isIconOnly
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          variant="ghost"
          onPress={() => setIsVisible((prev) => !prev)}
        >
          <Icon aria-hidden="true" className="text-muted size-4" />
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  )
}
