import z from 'zod'

import { clamp } from '~/common/utils/clamp'
import { getStorageItem } from '~/common/utils/storage'

const volumeSchema = z.number().min(0).max(1)

export const normalizeVolumeForAudio = (volumePercent: number) => clamp(volumePercent, 0, 100) / 100

export const normalizeVolumeForUI = (audioVolume: number) =>
  Math.round(clamp(audioVolume, 0, 1) * 100)

export const getVolumeFromStorage = (key: 'volume' | 'previousVolume' = 'volume') => {
  return getStorageItem(key, volumeSchema, 0.5)
}
