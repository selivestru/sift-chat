import { Button } from '@heroui/react'

import { Icon, type IconName } from '~/common/ui/Icon'

import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'
import { normalizeVolumeForAudio, normalizeVolumeForUI } from '../utils/volume'
import { VolumeSlider } from './VolumeSlider'

export const VolumeControl = () => {
  const volume = usePlayerStore((state) => state.volume)
  const previousVolume = usePlayerStore((state) => state.previousVolume)
  const { setVolume } = usePlayer()

  const handleChangeVolume = (value: number) => {
    setVolume(normalizeVolumeForAudio(value))
  }

  const getVolumeIcon = () => {
    let icon: IconName

    if (volume >= 0.75) {
      icon = 'volume-high'
    } else if (volume >= 0.25) {
      icon = 'volume-medium'
    } else if (volume > 0) {
      icon = 'volume-low'
    } else {
      icon = 'volume-off'
    }

    return <Icon name={icon} />
  }

  const handleToggleVolume = () => {
    setVolume(volume > 0 ? 0 : previousVolume)
  }

  const volumePercent = normalizeVolumeForUI(volume)

  return (
    <div className="flex items-center gap-2">
      <Button
        isIconOnly
        aria-label={volume > 0 ? 'Mute' : 'Unmute'}
        variant="ghost"
        onPress={handleToggleVolume}
      >
        {getVolumeIcon()}
      </Button>
      <VolumeSlider value={volumePercent} onValueChange={handleChangeVolume} className="w-31.25" />
    </div>
  )
}
