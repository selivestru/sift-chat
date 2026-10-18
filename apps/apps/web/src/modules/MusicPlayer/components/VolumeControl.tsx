import { VolumeCross, VolumeDown, VolumeHigh, VolumeLow2, type IconComponent } from 'reicon-react'

import { Slider } from '~/common/ui/Slider'

import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'
import { normalizeVolumeForAudio, normalizeVolumeForUI } from '../utils/volume'

export const VolumeControl = () => {
  const volume = usePlayerStore((state) => state.volume)
  const { setVolume } = usePlayer()

  const handleChangeVolume = (value: number) => {
    setVolume(normalizeVolumeForAudio(value))
  }

  const getVolumeIcon = () => {
    let Icon: IconComponent

    if (volume >= 0.75) {
      Icon = VolumeHigh
    } else if (volume >= 0.25) {
      Icon = VolumeLow2
    } else if (volume > 0) {
      Icon = VolumeDown
    } else {
      Icon = VolumeCross
    }

    return <Icon />
  }

  const volumePercent = normalizeVolumeForUI(volume)

  return (
    <div className="flex items-center justify-end-safe gap-2">
      {getVolumeIcon()}
      <Slider
        value={volumePercent}
        onValueChange={handleChangeVolume}
        updateMode="onDrag"
        step={1}
        min={0}
        max={100}
        aria-label="Volume slider"
        className="w-31.25"
      />
    </div>
  )
}
