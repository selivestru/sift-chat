interface ShowProps {
  when: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const Show = ({ when, fallback, children }: ShowProps) => {
  return when ? children : (fallback ?? null)
}
