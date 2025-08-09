import { redirect } from 'next/navigation'

import { createProject } from '@/app/api/projects/dev-store'
import { getSession } from '@/features/account/controllers/get-session'

// Forces a loading page (loading.tsx) while the app is being created and ensures auth
export default async function NewAppRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>
}) {
  const session = await getSession().catch(() => undefined)
  const search = await searchParams

  if (!session) {
    // reconstruct the search params
    const newParams = new URLSearchParams()
    Object.entries(search).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((v) => newParams.append(key, v))
      else if (value != null) newParams.set(key, value)
    })

    redirect(`/login?after_auth_return_to=${encodeURIComponent('/apps/new?' + newParams.toString())}`)
  }

  let message: string | undefined
  if (Array.isArray(search.message)) message = search.message[0]
  else message = search.message as string | undefined

  const record = createProject(decodeURIComponent(message ?? ''), (search.template as string) || undefined)

  redirect(`/apps/${record.id}/editor/preview`)
}


