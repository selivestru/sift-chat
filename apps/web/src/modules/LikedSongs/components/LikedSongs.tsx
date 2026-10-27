import { tracks } from '../../../../public/test/tracks'
import { LikedSongsTable } from './LikedSongsTable'

export const LikedSongs = () => {
  return (
    <div>
      <div className="h-[500px]"></div>
      <LikedSongsTable data={tracks} />
    </div>
  )
}
