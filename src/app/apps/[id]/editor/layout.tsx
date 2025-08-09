import { PropsWithChildren, use } from 'react'

import BuilderNavbar from '@/components/builder-navbar'
import EditorChat from '@/components/editor-chat'

export default function EditorLayout({ children, params }: PropsWithChildren & { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div className="flex min-h-screen w-full flex-col">
      <BuilderNavbar appId={id} />
      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-4 px-4 py-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Left: persistent chat (1 col on md, 1 col on lg) */}
        <div className="md:col-span-1 lg:col-span-1">
          <EditorChat appId={id} />
        </div>
        {/* Right: page content area (2 cols on md, 3 cols on lg) */}
        <div className="md:col-span-2 lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}


