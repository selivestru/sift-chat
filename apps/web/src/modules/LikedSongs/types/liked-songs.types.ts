import type { Track } from '~/modules/Track'

export interface LikedSong extends Track {
  likedAt: string
}
