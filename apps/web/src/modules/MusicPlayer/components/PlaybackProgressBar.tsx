import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'
import { PlaybackSlider } from './PlaybackSlider'

export const PlaybackProgressBar = () => {
  const currentTime = usePlayerStore((state) => state.currentTime)
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const { seek, getCurrentTime } = usePlayer()

  const duration = 130

  return (
    <PlaybackSlider
      key={currentTrack?.audioUrl ?? 'no-track'}
      value={currentTime}
      duration={duration}
      disabled={!currentTrack}
      isPlaying={isPlaying}
      getCurrentTime={getCurrentTime}
      onSeek={seek}
    />
  )
}
