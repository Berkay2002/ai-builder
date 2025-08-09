"use client"

import { use, useEffect, useMemo, useState } from 'react'

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [status, setStatus] = useState<string>('queued')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function tick() {
      try {
        const res = await fetch(`/api/projects/${id}/status`, { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { status: string }
        if (!cancelled) setStatus(json.status)
      } catch {
        // ignore transient errors
      }
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    async function fetchPreview() {
      try {
        const res = await fetch(`/api/projects/${id}/preview`, { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { preview_url: string }
        if (!cancelled) setPreviewUrl(json.preview_url)
      } catch {
        // ignore
      }
    }
    if (status === 'preview_ready') fetchPreview()
    return () => {
      cancelled = true
    }
  }, [id, status])

  return (
    <div className="min-h-[60vh]">
      {status !== 'preview_ready' ? (
        <BuilderSplash status={status} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="text-lg font-medium text-gray-800">Preview ready</div>
          {previewUrl ? (
            <iframe title="app-preview" src={previewUrl} className="h-[60vh] w-full rounded-lg border" />
          ) : (
            <div className="text-sm text-gray-600">Preparing preview…</div>
          )}
        </div>
      )}
    </div>
  )
}

function StatusPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`rounded-full px-3 py-1 text-xs ${active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
      {label}
    </div>
  )
}

function BuilderSplash({ status }: { status: string }) {
  const steps = useMemo(
    () => ['planning', 'manifest_ready', 'generating_files', 'building', 'testing', 'preview_ready'],
    []
  )
  const activeIndex = Math.max(0, steps.indexOf(status))

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="h-20 w-20 animate-pulse rounded-full bg-orange-200 ring-8 ring-orange-100" />
      <div>
        <div className="text-xl font-medium text-gray-800">Creating Your App</div>
        <div className="mt-1 text-sm text-gray-600">This might take a few minutes…</div>
      </div>
      <div className="mt-2 text-xs text-gray-500">thinking…</div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <StatusPill key={s} label={s.replace(/_/g, ' ')} active={i <= activeIndex} />
        ))}
      </div>
    </div>
  )
}


