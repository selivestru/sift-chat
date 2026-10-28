import { Link } from '@tanstack/react-router'

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

export const Navigation = () => {
  return (
    <nav>
      <ul className="space-y-2">
        {navigationItems.map(({ name, href, icon }) => (
          <li key={href}>
            <Link
              to={href}
              className="text-muted relative flex items-center gap-2 px-4 py-2 font-medium"
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
                  {name}
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
