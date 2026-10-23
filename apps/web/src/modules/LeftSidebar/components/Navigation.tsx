import { Link } from '@tanstack/react-router'
import { Heart, Home, Search, type IconComponent } from 'reicon-react'

import { Show } from '~/common/ui/Show'

interface NavigationItem {
  name: string
  href: string
  icon: IconComponent
}

const navigationItems: NavigationItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Liked Songs', href: '/liked-songs', icon: Heart },
]

export const Navigation = () => {
  return (
    <nav>
      <ul className="space-y-2">
        {navigationItems.map(({ name, href, icon: Icon }) => (
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
                  <Icon strokeWidth={2} />
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
