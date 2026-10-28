import { Table } from '@heroui/react'
import { Clock } from 'reicon-react'

import type { Track } from '~/modules/Track'

import { LikedSongsTableRow } from './LikedSongsTableRow'

interface LikedSongsTableProps {
  data: Track[]
}

export const LikedSongsTable = ({ data }: LikedSongsTableProps) => {
  return (
    <Table className="text-sm">
      <Table.ScrollContainer className="overflow-visible">
        <Table.Content aria-label="Liked songs table" className="table-fixed">
          <Table.Header className="sticky top-0 z-10">
            <Table.Column isRowHeader className="w-16 text-right">
              #
            </Table.Column>
            <Table.Column className="w-1/3">Title</Table.Column>
            <Table.Column className="w-1/3">Album</Table.Column>
            <Table.Column className="w-48">Date added</Table.Column>
            <Table.Column className="w-12" />
            <Table.Column className="w-16 text-right">
              <div className="flex justify-end">
                <Clock className="size-5" />
              </div>
            </Table.Column>
            <Table.Column className="w-16" />
          </Table.Header>
          <Table.Body items={data}>
            {(track) => {
              const index = data.findIndex((item) => item.id === track.id)
              return <LikedSongsTableRow index={index} track={track} tracks={data} />
            }}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
