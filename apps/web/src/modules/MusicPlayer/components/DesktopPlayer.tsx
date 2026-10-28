import { NextTrackButton } from './NextTrackButton'
import { PlaybackProgressBar } from './PlaybackProgressBar'
import { PlayPauseButton } from './PlayPauseButton'
import { PreviousTrackButton } from './PreviousTrackButton'
import { QueueSidebarToggle } from './QueueSidebarToggle'
import { RepeatButton } from './RepeatButton'
import { ShuffleButton } from './ShuffleButton'
import { TrackInfo } from './TrackInfo'
import { VolumeControl } from './VolumeControl'

export const DesktopPlayer = () => {
  return (
    <div className="grid h-full grid-cols-[1fr_1.3fr_1fr] items-center gap-2 px-5 py-2">
      <TrackInfo />
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <ShuffleButton />
          <PreviousTrackButton />
          <PlayPauseButton />
          <NextTrackButton />
          <RepeatButton />
        </div>
        <PlaybackProgressBar />
      </div>
      <div className="flex items-center justify-end gap-2">
        <QueueSidebarToggle />
        <VolumeControl />
      </div>
    </div>
  )
}
