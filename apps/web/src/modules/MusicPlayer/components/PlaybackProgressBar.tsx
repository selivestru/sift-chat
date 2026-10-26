import { useState } from 'react'

import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'
import { formatPlaybackTime } from '../utils/formatPlaybackTime'
import { PlaybackSlider } from './PlaybackSlider'

export const PlaybackProgressBar = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const currentTime = usePlayerStore((state) => state.currentTime)
  const { seek } = usePlayer()
  const [preview, setPreview] = useState<{ trackId: string | null; time: number } | null>(null)
  const [showRemaining, setShowRemaining] = useState(false)

  const currentTrackId = currentTrack?.id ?? null
  const duration = currentTrack ? currentTrack.durationMs / 1000 : null
  const isDurationAvailable = duration !== null && Number.isFinite(duration) && duration > 0
  const previewTime = preview?.trackId === currentTrackId ? preview.time : null
  const displayedTime = previewTime ?? currentTime ?? 0
  const durationLabel = isDurationAvailable ? formatPlaybackTime(duration) : '--:--'
  const rightTimeLabel = isDurationAvailable
    ? showRemaining
      ? `-${formatPlaybackTime(duration - displayedTime)}`
      : durationLabel
    : '--:--'

  return (
    <div className="flex w-full items-center gap-2">
      <span className="text-muted w-10 shrink-0 text-right text-xs tabular-nums">
        {isDurationAvailable ? formatPlaybackTime(displayedTime) : '--:--'}
      </span>
      <PlaybackSlider
        key={currentTrackId ?? 'no-track'}
        value={currentTime ?? 0}
        duration={duration}
        onSeek={seek}
        onPreviewChange={(time) => {
          setPreview(time === null ? null : { trackId: currentTrackId, time })
        }}
      />
      <button
        type="button"
        aria-label={showRemaining ? 'Show total duration' : 'Show remaining time'}
        disabled={!isDurationAvailable}
        className="text-muted w-10 shrink-0 text-left text-xs tabular-nums disabled:cursor-default"
        onClick={() => setShowRemaining((prev) => !prev)}
      >
        {rightTimeLabel}
      </button>
    </div>
  )
}
