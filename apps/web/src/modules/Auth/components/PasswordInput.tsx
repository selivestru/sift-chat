import { Button, InputGroup, type InputGroupInputProps } from '@heroui/react'
import { useState } from 'react'

import { Icon } from '~/common/ui/Icon'

export type PasswordInputProps = InputGroupInputProps

export const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false)

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
          <Icon name={isVisible ? 'eye' : 'eye-off'} className="text-muted size-4" />
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  )
}
