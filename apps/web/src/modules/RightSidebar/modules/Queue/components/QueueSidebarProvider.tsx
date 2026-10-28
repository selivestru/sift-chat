import { createContext, useMemo, useState } from 'react'

interface QueueSidebarContext {
  isOpen: boolean
  toggle: () => void
}

export const QueueSidebarContext = createContext<QueueSidebarContext | null>(null)

export const QueueSidebarProvider = ({ children }: React.PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(
    () => ({
      isOpen,
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [isOpen],
  )

  return <QueueSidebarContext value={value}>{children}</QueueSidebarContext>
}
