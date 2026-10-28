import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'

import type { ArtistSummary } from '../types/artist.types'

interface ArtistLinksProps {
  artists: ArtistSummary[]
}

export const ArtistLinks = ({ artists }: ArtistLinksProps) => (
  <span className="truncate">
    {artists.map((artist, index) => (
      <Fragment key={artist.id}>
        <Link
          to="/artist/$id"
          params={{ id: artist.id }}
          className="hover:text-foreground hover:underline"
        >
          {artist.name}
        </Link>
        {index < artists.length - 1 && ', '}
      </Fragment>
    ))}
  </span>
)
