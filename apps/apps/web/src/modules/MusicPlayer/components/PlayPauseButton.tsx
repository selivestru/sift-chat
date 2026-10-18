import { Pause, Play } from 'reicon-react'

import { usePlayer } from '../hooks/usePlayer'
import { usePlayerStore } from '../stores/player.store'

export const PlayPauseButton = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)

  const { play, pause } = usePlayer()

  const toggleIsPlaying = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const Icon = isPlaying ? Pause : Play

  return (
    <button onClick={toggleIsPlaying} disabled={!currentTrack}>
      <Icon className="size-5" />
    </button>
  )
}
