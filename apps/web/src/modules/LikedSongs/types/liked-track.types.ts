import type { Track } from '~/modules/Track'

export interface LikedTrack extends Track {
  likedAt: string
}
