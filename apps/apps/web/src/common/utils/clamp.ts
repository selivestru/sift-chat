export const clamp = (volume: number, min: number, max: number) =>
  Math.min(max, Math.max(min, volume))
