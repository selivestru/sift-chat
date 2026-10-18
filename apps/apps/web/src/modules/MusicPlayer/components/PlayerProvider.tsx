import { createContext, useEffect, useMemo, useRef, useState } from 'react'

import { setStorageItem } from '~/common/utils/storage'

import { AudioEngine } from '../core/audioEngine'
import { usePlayerStore } from '../stores/player.store'
import { getVolumeFromStorage } from '../utils/volume'

interface PlayerProviderContext {
  play: () => void
  pause: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
}

export const PlayerContext = createContext<PlayerProviderContext | null>(null)

interface PlayerProviderProps {
  children: React.ReactNode
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [audioEngine] = useState(() => new AudioEngine(getVolumeFromStorage()))

  const currentTimeRef = useRef(0)

  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying)
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime)
  const setVolumeInStore = usePlayerStore((state) => state.setVolume)

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleTimeUpdate = () => {
      const seconds = Math.floor(audioEngine.currentTime)

      if (currentTimeRef.current === 0) {
        setCurrentTime(seconds)
        return
      }

      if (currentTimeRef.current === seconds) return

      currentTimeRef.current = seconds
      setCurrentTime(seconds)
    }

    const handleVolumeChange = () => {
      setVolumeInStore(audioEngine.volume)
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
      audioEngine.subscribe('timeupdate', handleTimeUpdate),
      audioEngine.subscribe('volumechange', handleVolumeChange),
      audioEngine.subscribe('ended', handleEnded),
      audioEngine.subscribe('error', handleError),
    ]

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEngine])

  useEffect(() => {
    if (!currentTrack) return

    audioEngine.setSrc(currentTrack.audioUrl)
    audioEngine.play().catch((error) => {
      console.error('Failed to play audio', error)
      setIsPlaying(false)
    })

    return () => {
      currentTimeRef.current = 0
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEngine, currentTrack])

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
      seek: (seconds: number) => audioEngine.seek(seconds),
      setVolume: (volume: number) => {
        const normalizedVolume = Math.min(1, Math.max(0, volume))
        audioEngine.setVolume(normalizedVolume)
        setStorageItem('volume', normalizedVolume)
      },
    }),
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [audioEngine],
  )

  return <PlayerContext value={value}>{children}</PlayerContext>
}
