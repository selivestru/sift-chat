import { tracks } from '../../../../public/test/tracks'
import { LikedSongsTable } from './LikedSongsTable'

export const LikedSongs = () => {
  return (
    <div>
      {/* @ts-ignore */}
      <LikedSongsTable data={tracks} />
    </div>
  )
}
