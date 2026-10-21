import { useState } from 'react'
import { Eye, EyeOff } from 'reicon-react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/common/ui/InputGroup'

export type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>

export const PasswordInput = ({ disabled, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput
        autoCapitalize="none"
        spellCheck={false}
        disabled={disabled}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-sm"
          className="size-9"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-controls={props.id}
          disabled={disabled}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          {isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
