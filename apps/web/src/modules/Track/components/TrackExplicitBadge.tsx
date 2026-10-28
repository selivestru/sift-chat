interface TrackExplicitBadgeProps {
  explicit: boolean
}

export const TrackExplicitBadge = ({ explicit }: TrackExplicitBadgeProps) => {
  if (!explicit) return

  return (
    <span
      aria-label="Explicit"
      className="bg-surface-tertiary text-foreground shrink-0 rounded px-1 text-xs font-bold"
    >
      E
    </span>
  )
}
