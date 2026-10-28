import { Button } from '@heroui/react'

import { Icon } from '~/common/ui/Icon'

import { usePlayerStore } from '../stores/player.store'

export const RepeatButton = () => {
  const repeatMode = usePlayerStore((state) => state.repeatMode)
  const cycleRepeatMode = usePlayerStore((state) => state.cycleRepeatMode)
  const icon = repeatMode === 'one' ? 'repeat-one' : 'repeat'

  return (
    <Button
      isIconOnly
      aria-label={`Repeat: ${repeatMode === 'off' ? 'off' : repeatMode === 'all' ? 'all' : 'one'}`}
      variant="ghost"
      onPress={cycleRepeatMode}
      className={repeatMode === 'off' ? undefined : 'text-accent'}
    >
      <Icon name={icon} />
    </Button>
  )
}
