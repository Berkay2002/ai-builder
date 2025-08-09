import Link from 'next/link'

import { signOut } from '@/app/(auth)/auth-actions'
import { AccountMenu } from '@/components/account-menu'
import { Button } from '@/components/ui/button'

export default function BuilderNavbar({ appId }: { appId: string }) {
  const shortId = appId.length > 8 ? `${appId.slice(0, 4)}…${appId.slice(-3)}` : appId

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4">
        {/* Left: brand + app */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span
              aria-hidden
              className="h-5 w-5 rounded-full ring-2 ring-orange-300/60"
              style={{
                background:
                  'conic-gradient(from 0deg, #f97316, #fdba74, #f59e0b, #f97316)',
              }}
            />
            <span>Novu Builder</span>
          </Link>

          <div className="hidden text-gray-300 sm:block">/</div>
          <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">
            <span className="text-gray-500">App</span>
            <span className="font-mono text-gray-900">{shortId}</span>
          </div>

          <nav className="ms-4 hidden items-center gap-2 text-sm sm:flex">
            <Link className="rounded px-2 py-1 hover:bg-gray-100" href={`/apps/${appId}/editor/preview`}>
              Preview
            </Link>
            <Link className="rounded px-2 py-1 hover:bg-gray-100" href={`/apps/${appId}/editor/code`}>
              Code
            </Link>
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            Share
          </Button>
          <Button size="sm" className="rounded-full bg-lime-200 text-gray-900 hover:bg-lime-300">
            Publish
          </Button>
          <div className="ms-1">
            <AccountMenu signOut={signOut} />
          </div>
        </div>
      </div>
    </header>
  )
}


