import { use } from 'react'

export default function CodeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-white/70 p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Generated Files</h2>
        <div className="text-sm text-gray-500">File list will appear here once the preview is ready.</div>
      </div>
      <div className="rounded-lg border bg-white/70 p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Preview</h2>
        <div className="aspect-video w-full rounded bg-gray-50" />
      </div>
      <div className="col-span-full text-xs text-gray-500">App ID: {id}</div>
    </div>
  )
}


