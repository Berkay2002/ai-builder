"use server";

import AppWrapper from '@/components/app-wrapper'
import { getApp } from '@/actions/get-app'
import { freestyle } from '@/lib/freestyle'
import { getUser } from '@/auth/stack-auth'
import { chatState } from '@/actions/chat-streaming'
import { db, appUsers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getUser()

  const userPermission = (
    await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.userId, user.userId))
      .limit(1)
  ).at(0)

  if (!userPermission?.permissions) {
    return <ProjectNotFound />
  }

  const app = await getApp(id).catch(() => undefined)

  if (!app) {
    return <ProjectNotFound />
  }

  const { codeServerUrl, ephemeralUrl } = await freestyle.requestDevServer({
    repoId: app.info.gitRepo,
  })

  const domain = app.info.previewDomain

  return (
    <AppWrapper
      key={app.info.id}
      baseId={app.info.baseId}
      codeServerUrl={codeServerUrl}
      appName={app.info.name}
      initialMessages={app.messages}
      consoleUrl={ephemeralUrl + '/__console'}
      repo={app.info.gitRepo}
      appId={app.info.id}
      repoId={app.info.gitRepo}
      domain={domain ?? undefined}
      running={(await chatState(app.info.id)).state === 'running'}
    />
  )
}

function ProjectNotFound() {
  return (
    <div className="text-center my-16">
      Project not found or you don&apos;t have permission to access it.
      <div className="flex justify-center mt-4">
        <Link className={buttonVariants()} href="/">
          Go back to home
        </Link>
      </div>
    </div>
  )
}


