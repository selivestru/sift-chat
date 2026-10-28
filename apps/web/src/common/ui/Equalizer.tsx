import { cn } from '@heroui/react'

export const Equalizer = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <svg
      data-slot="equalizer"
      role="img"
      aria-label="Now playing"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn('size-4 text-accent', className)}
      {...props}
    >
      <rect className="equalizer-bar" x="1" y="2" width="3" height="12" rx="1.5" />
      <rect className="equalizer-bar" x="6.5" y="2" width="3" height="12" rx="1.5" />
      <rect className="equalizer-bar" x="12" y="2" width="3" height="12" rx="1.5" />
    </svg>
  )
}
