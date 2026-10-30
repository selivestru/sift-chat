import type { ArtistSummary } from '~/modules/Artist'

export const ALBUM_TYPE = {
  ALBUM: 'album',
  SINGLE: 'single',
  EP: 'ep',
  COMPILATION: 'compilation',
} as const

export type AlbumType = (typeof ALBUM_TYPE)[keyof typeof ALBUM_TYPE]

export interface AlbumSummary {
  id: string
  name: string
  imageUrl: string | null
}

export interface Album extends AlbumSummary {
  type: AlbumType
  artists: ArtistSummary[]
  releaseDate: string
}
