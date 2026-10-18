import { Slider } from '~/common/ui/Slider'
import { formatTime } from '~/common/utils/formatTime'

import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'

export const PlaybackProgressBar = () => {
  const currentTime = usePlayerStore((state) => state.currentTime)
  const { seek } = usePlayer()

  const duration = 130
  const formattedCurrentTime = currentTime ? formatTime(currentTime) : '--:--'
  const formattedDuration = duration ? formatTime(duration) : '--:--'

  return (
    <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 tabular-nums">
      <span>{formattedCurrentTime}</span>
      <Slider
        value={currentTime}
        onValueChange={seek}
        updateMode="onRelease"
        min={0}
        max={duration ?? 1}
        step={1}
        aria-label="Seek slider"
      />
      <span>{formattedDuration}</span>
    </div>
  )
}
