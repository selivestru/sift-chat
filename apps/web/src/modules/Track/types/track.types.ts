import type { AlbumSummary } from '~/modules/Album'
import type { ArtistSummary } from '~/modules/Artist'

export interface Track {
  id: string
  name: string
  durationMs: number
  artists: ArtistSummary[]
  album: AlbumSummary
  trackNumber: number
  explicit: boolean
  previewUrl: string | null
}
