import { cn } from 'cn'

export type IconName =
  | 'clock'
  | 'close'
  | 'chevron-left'
  | 'chevron-right'
  | 'home'
  | 'search'
  | 'heart'
  | 'volume-high'
  | 'volume-medium'
  | 'volume-low'
  | 'volume-off'
  | 'eye'
  | 'eye-off'
  | 'queue'
  | 'play'
  | 'pause'
  | 'next'
  | 'previous'
  | 'repeat'
  | 'repeat-one'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
}

export const Icon = ({ name, className, ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    className={cn('inline-block size-6', className)}
    fill="currentColor"
    {...props}
  >
    <use href={`/assets/icons/sprite.svg#${name}`} />
  </svg>
)
