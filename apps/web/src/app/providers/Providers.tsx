import { Toast } from '@heroui/react'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <TanstackRouterProvider />
      <Toast.Provider />
    </TanstackQueryProvider>
  )
}
