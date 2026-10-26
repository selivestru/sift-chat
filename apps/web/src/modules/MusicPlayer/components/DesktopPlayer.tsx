import { PlaybackProgressBar } from './PlaybackProgressBar'
import { PlayPauseButton } from './PlayPauseButton'
import { TrackInfo } from './TrackInfo'
import { VolumeControl } from './VolumeControl'

export const DesktopPlayer = () => {
  return (
    <div className="grid h-full grid-cols-[1fr_1.3fr_1fr] items-center gap-2 px-5 py-2">
      <TrackInfo />
      <div className="flex flex-col items-center gap-2">
        <PlayPauseButton />
        <PlaybackProgressBar />
      </div>
      <VolumeControl />
    </div>
  )
}
