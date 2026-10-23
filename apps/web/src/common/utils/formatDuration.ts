export const formatDuration = (durationMs: number) => {
  const minutes = Math.floor(durationMs / 60_000)
  const remainingSeconds = Math.floor((durationMs % 60_000) / 1_000)

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}
