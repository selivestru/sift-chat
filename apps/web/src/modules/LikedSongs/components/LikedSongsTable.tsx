import { Table } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { Clock } from 'reicon-react'

import { formatDateAdded } from '~/common/utils/formatDateAdded'
import { formatDuration } from '~/common/utils/formatDuration'
import { TrackRowInfo, TrackRowPlaybackControl } from '~/modules/Track'

import type { LikedTrack } from '../types/liked-track.types'

interface LikedSongsTableProps {
  data: LikedTrack[]
}

export const LikedSongsTable = ({ data }: LikedSongsTableProps) => {
  return (
    <Table className="text-sm">
      <Table.ScrollContainer>
        <Table.Content aria-label="Liked songs table" className="w-full min-w-208 table-fixed">
          <Table.Header className="sticky top-0 z-10">
            <Table.Column isRowHeader className="w-16 text-right">
              #
            </Table.Column>
            <Table.Column>Title</Table.Column>
            <Table.Column className="w-1/4">Album</Table.Column>
            <Table.Column className="w-48">Date added</Table.Column>
            <Table.Column className="w-12" />
            <Table.Column className="w-22 text-right">
              <div className="flex justify-end">
                <Clock className="size-5" />
              </div>
            </Table.Column>
          </Table.Header>
          <Table.Body items={data}>
            {(track) => {
              const index = data.findIndex((item) => item.id === track.id)

              return (
                <Table.Row key={track.id} className="group/track-row">
                  <Table.Cell className="w-16 text-right tabular-nums">
                    <TrackRowPlaybackControl position={index + 1} track={track} />
                  </Table.Cell>
                  <Table.Cell>
                    <TrackRowInfo track={track} />
                  </Table.Cell>
                  <Table.Cell className="w-1/4">
                    <Link
                      to="/album/$id"
                      params={{ id: track.album.id }}
                      className="text-muted hover:text-foreground block truncate hover:underline"
                    >
                      {track.album.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="w-46">
                    {formatDateAdded(new Date('2022-01-01').toISOString())}
                  </Table.Cell>
                  <Table.Cell className="w-12" />
                  <Table.Cell className="w-20 text-right tabular-nums">
                    {formatDuration(track.durationMs)}
                  </Table.Cell>
                </Table.Row>
              )
            }}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
