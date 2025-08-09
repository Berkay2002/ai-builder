export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <div className="text-center text-sm text-gray-700">Creating App</div>
        <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    </div>
  )
}


