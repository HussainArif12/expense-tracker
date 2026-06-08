import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Heart } from 'lucide-react'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

const links = [
  { text: 'Trading212 One Month', link: '/trading_one_month' },
  { text: 'Trading212 multi-month', link: '/trading_multi_month' },
  { text: 'Sparkasse One month', link: '/sparkasse_one_month' },
  { text: 'Sparkasse multi-month', link: '/sparkasse_multi_month' },
]

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="bg-pink-300  p-4 flex flex-row justify-center items-center relative min-h-[50px]">
          <div className="absolute left-4">
            <Link to="/">
              {' '}
              <Heart />{' '}
            </Link>
          </div>

          <div className="flex flex-row justify-center">
            {links.map((link) => (
              <div className="bg-blue-300 p-5 mx-1 rounded-md" key={link.link}>
                <Link to={link.link}>{link.text}</Link>
              </div>
            ))}
          </div>
        </div>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
