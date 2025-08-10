import { PropsWithChildren, use } from 'react'

import BuilderNavbar from '@/components/builder-navbar'

export default function EditorLayout({ children, params }: PropsWithChildren & { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div className="flex min-h-screen w-full flex-col">
      <BuilderNavbar appId={id} />
      <div className="flex-1">{children}</div>
    </div>
  )
}


