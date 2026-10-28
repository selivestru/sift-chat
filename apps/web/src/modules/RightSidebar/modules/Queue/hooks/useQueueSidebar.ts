import { use } from 'react'

import { QueueSidebarContext } from '../components/QueueSidebarProvider'

export const useQueueSidebar = () => {
  const context = use(QueueSidebarContext)

  if (!context) {
    throw new Error('useQueueSidebar must be used within a QueueSidebarProvider')
  }

  return context
}
