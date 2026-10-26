export const formatPlaybackTime = (timeInSeconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(timeInSeconds))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${Math.floor(totalSeconds / 60)}:${String(seconds).padStart(2, '0')}`
}
