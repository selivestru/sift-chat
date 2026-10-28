import { Button, Table } from '@heroui/react'
import type { ReactNode } from 'react'

import { Icon } from '~/common/ui/Icon'
import { formatDuration } from '~/common/utils/formatDuration'
import { usePlayerStore } from '~/modules/MusicPlayer'
import type { PlaybackSource } from '~/modules/MusicPlayer/stores/player.store'

import type { Track } from '../types/track.types'
import { TrackLibraryControl } from './TrackLibraryControl'
import { TrackRowInfo } from './TrackRowInfo'
import { TrackRowPlaybackControl } from './TrackRowPlaybackControl'

export interface TrackTableColumn {
  key: string
  title: ReactNode
  className?: string
  render: (track: Track) => ReactNode
}

interface TrackTableProps {
  tracks: Track[]
  source: PlaybackSource
  ariaLabel: string
  columns: TrackTableColumn[]
}

export const TrackTable = ({ tracks, source, ariaLabel, columns }: TrackTableProps) => (
  <Table className="text-sm">
    <Table.ScrollContainer className="overflow-visible">
      <Table.Content aria-label={ariaLabel} className="table-fixed">
        <Table.Header className="sticky top-0 z-10">
          <Table.Column isRowHeader className="w-15 text-right">
            #
          </Table.Column>
          <Table.Column className="w-2/5">Title</Table.Column>
          {columns.map((column) => (
            <Table.Column key={column.key} className={column.className}>
              {column.title}
            </Table.Column>
          ))}
          <Table.Column className="w-9" />
          <Table.Column className="w-16 text-right">
            <div className="flex justify-end">
              <Icon name="clock" className="size-5" />
            </div>
          </Table.Column>
          <Table.Column className="w-20" />
        </Table.Header>
        <Table.Body items={tracks}>
          {(track) => {
            const index = tracks.findIndex((item) => item.id === track.id)
            const handlePlay = () => usePlayerStore.getState().startContext(source, tracks, index)
            const addToQueue = () =>
              usePlayerStore.getState().addToQueue({ id: crypto.randomUUID(), track })

            return (
              <Table.Row
                key={track.id}
                className="group/track-row hover:bg-surface-tertiary"
                onDoubleClick={handlePlay}
              >
                <Table.Cell className="text-right tabular-nums">
                  <TrackRowPlaybackControl
                    position={index + 1}
                    track={track}
                    source={source}
                    onPlay={handlePlay}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TrackRowInfo track={track} source={source} />
                </Table.Cell>
                {columns.map((column) => (
                  <Table.Cell key={column.key}>{column.render(track)}</Table.Cell>
                ))}
                <Table.Cell className="p-0 text-right">
                  <TrackLibraryControl trackId={track.id} isLiked={!!track.likedAt} />
                </Table.Cell>
                <Table.Cell className="text-right tabular-nums">
                  {formatDuration(track.durationMs)}
                </Table.Cell>
                <Table.Cell>
                  <Button onPress={addToQueue}>Add</Button>
                </Table.Cell>
              </Table.Row>
            )
          }}
        </Table.Body>
      </Table.Content>
    </Table.ScrollContainer>
  </Table>
)
