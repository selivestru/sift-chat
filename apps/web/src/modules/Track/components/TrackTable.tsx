import { Table, type Selection } from '@heroui/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Icon } from '~/common/ui/Icon'
import { formatDuration } from '~/common/utils/formatDuration'
import { usePlayerStore } from '~/modules/MusicPlayer'
import type { PlaybackSource } from '~/modules/MusicPlayer/stores/player.store'

import type { Track } from '../types/track.types'
import { TrackActionsDropdown } from './TrackActionsDropdown'
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

export const TrackTable = ({ tracks, source, ariaLabel, columns }: TrackTableProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (selectedTrackId === null) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return

      const selectedRow = tableRef.current?.querySelector('tr[aria-selected="true"]')
      const popover = event.target.closest('[data-track-actions-id]')
      if (
        selectedRow?.contains(event.target) ||
        popover?.getAttribute('data-track-actions-id') === selectedTrackId
      )
        return

      setSelectedTrackId(null)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [selectedTrackId])

  useEffect(() => {
    if (selectedTrackId !== null && !tracks.some((track) => track.id === selectedTrackId)) {
      // oxlint-disable-next-line react/set-state-in-effect
      setSelectedTrackId(null)
    }
  }, [selectedTrackId, tracks])

  const handleSelectionChange = (keys: Selection) => {
    if (keys !== 'all') setSelectedTrackId(String([...keys][0] ?? '') || null)
  }

  return (
    <Table className="text-sm">
      <Table.ScrollContainer className="overflow-visible">
        <Table.Content
          ref={tableRef}
          aria-label={ariaLabel}
          className="table-fixed"
          selectionMode="single"
          selectionBehavior="replace"
          disallowEmptySelection
          selectedKeys={selectedTrackId === null ? new Set() : new Set([selectedTrackId])}
          onSelectionChange={handleSelectionChange}
        >
          <Table.Header className="sticky top-0 z-10">
            <Table.Column isRowHeader className="w-15 text-right">
              #
            </Table.Column>
            <Table.Column>Title</Table.Column>
            {columns.map((column) => (
              <Table.Column key={column.key} className={column.className}>
                {column.title}
              </Table.Column>
            ))}
            <Table.Column className="w-17" />
            <Table.Column className="w-16 text-right">
              <div className="flex justify-end">
                <Icon name="clock" className="size-5" />
              </div>
            </Table.Column>
            <Table.Column className="w-17" />
          </Table.Header>
          <Table.Body>
            {tracks.map((track, index) => {
              const handlePlay = () => usePlayerStore.getState().startContext(source, tracks, index)

              return (
                <Table.Row
                  key={track.id}
                  id={track.id}
                  className="group/track-row hover:bg-surface-tertiary aria-selected:bg-surface-tertiary"
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
                  <Table.Cell>
                    <div className="opacity-0 group-hover/track-row:opacity-100 group-data-[selected=true]/track-row:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100">
                      <TrackLibraryControl trackId={track.id} isLiked={!!track.likedAt} />
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-right tabular-nums">
                    {formatDuration(track.durationMs)}
                  </Table.Cell>
                  <Table.Cell>
                    <TrackActionsDropdown
                      track={track}
                      onOpen={() => setSelectedTrackId(track.id)}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
