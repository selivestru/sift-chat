import { Link } from '@tanstack/react-router'
import { cn } from 'cn'

import { Icon, type IconName } from '~/common/ui/Icon'
import { Show } from '~/common/ui/Show'

interface NavigationItem {
  name: string
  href: string
  icon: IconName
}

const navigationItems: NavigationItem[] = [
  { name: 'Home', href: '/', icon: 'home' },
  { name: 'Search', href: '/search', icon: 'search' },
  { name: 'Liked Songs', href: '/liked-songs', icon: 'heart' },
]

export const Navigation = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <nav>
      <ul className="space-y-2">
        {navigationItems.map(({ name, href, icon }) => (
          <li key={href}>
            <Link
              to={href}
              aria-label={isCollapsed ? name : undefined}
              title={isCollapsed ? name : undefined}
              className={cn(
                'text-muted relative flex items-center gap-2 py-2 font-medium',
                isCollapsed ? 'justify-center' : 'px-4',
              )}
              activeProps={{
                className: 'bg-accent-muted text-accent!',
              }}
            >
              {({ isActive }) => (
                <>
                  <Show when={isActive}>
                    <span className="bg-accent absolute top-0 bottom-0 left-0 w-0.75" />
                  </Show>
                  <Icon name={icon} />
                  {!isCollapsed && name}
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
