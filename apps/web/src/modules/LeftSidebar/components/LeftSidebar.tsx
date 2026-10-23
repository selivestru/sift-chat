import { Separator } from '@heroui/react'

import { Navigation } from './Navigation'

export const LeftSidebar = () => {
  return (
    <aside className="border-r-border w-75 space-y-4 overflow-y-auto overscroll-contain border-r p-4">
      <div className="flex items-center gap-2 px-4 py-2">
        <img className="w-15" src="/assets/images/logo.png" alt="Logo" />
        <span className="text-2xl font-bold">Siftify</span>
      </div>
      <Separator />
      <Navigation />
      <Separator />
    </aside>
  )
}
