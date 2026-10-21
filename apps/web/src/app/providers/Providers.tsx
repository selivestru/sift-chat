import { Toaster } from '~/common/ui/Toast'
import { TooltipProvider } from '~/common/ui/Tooltip'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <TooltipProvider>
        <TanstackRouterProvider />
        <Toaster />
      </TooltipProvider>
    </TanstackQueryProvider>
  )
}
