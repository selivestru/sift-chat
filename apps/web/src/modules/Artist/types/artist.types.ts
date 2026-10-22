export interface ArtistSummary {
  id: string
  name: string
  imageUrl: string | null
}

export interface Artist extends ArtistSummary {
  biography: string | null
}
