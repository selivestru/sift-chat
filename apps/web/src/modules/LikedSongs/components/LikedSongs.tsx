import { tracks } from '../../../../public/test/tracks'
import { LikedSongsTable } from './LikedSongsTable'

export const LikedSongs = () => {
  return (
    <div>
      <LikedSongsTable data={tracks.slice(0, 5)} />
    </div>
  )
}
