import { createContext, useEffect, useMemo, useState } from 'react'

import { AudioEngine } from '../core/audioEngine'
import { usePlayerStore } from '../stores/player.store'

interface PlayerProviderContext {
  play: () => void
  pause: () => void
}

export const PlayerContext = createContext<PlayerProviderContext | null>(null)

interface PlayerProviderProps {
  children: React.ReactNode
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [audioEngine] = useState(() => new AudioEngine())
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying)

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = () => {
      console.error('Audio error', audioEngine.error)
      setIsPlaying(false)
    }

    const unsubscribers = [
      audioEngine.subscribe('play', handlePlay),
      audioEngine.subscribe('pause', handlePause),
      audioEngine.subscribe('ended', handleEnded),
      audioEngine.subscribe('error', handleError),
    ]

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [audioEngine, setIsPlaying])

  useEffect(() => {
    if (!currentTrack) return

    audioEngine.setSrc(currentTrack.audioUrl)
    audioEngine.play().catch((error) => {
      console.error('Failed to play audio', error)
      setIsPlaying(false)
    })
  }, [audioEngine, currentTrack, setIsPlaying])

  useEffect(() => {
    return () => {
      audioEngine.destroy()
      setIsPlaying(false)
    }
  }, [audioEngine, setIsPlaying])

  const value = useMemo<PlayerProviderContext>(
    () => ({
      play: () => {
        audioEngine.play().catch((error) => {
          console.error('Failed to play audio', error)
          setIsPlaying(false)
        })
      },
      pause: () => audioEngine.pause(),
    }),
    [audioEngine, setIsPlaying],
  )

  return <PlayerContext value={value}>{children}</PlayerContext>
}
