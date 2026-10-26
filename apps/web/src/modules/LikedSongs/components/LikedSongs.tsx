import { tracks } from '../../../../public/test/tracks'
import { LikedSongsTable } from './LikedSongsTable'

export const LikedSongs = () => {
  return (
    <div>
      <LikedSongsTable data={tracks} />
    </div>
  )
}
