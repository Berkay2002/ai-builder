"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp } from "lucide-react"

import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { useToast } from "./ui/use-toast"

const SUGGESTIONS = ["Reporting Dashboard", "Gaming Platform", "Onboarding Portal", "Networking App", "Room Visualizer"]

export default function HeroSearch() {
  const [value, setValue] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    const trimmedPrompt = value.trim()
    if (!trimmedPrompt) {
      toast({ title: "Missing prompt", description: "Please enter what you want to build." })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      })

      if (!response.ok) throw new Error("Failed to create project")
      const data = (await response.json()) as { id: string }

      // Navigate to editor preview
      router.push(`/apps/${data.id}/editor/preview`)
    } catch (error) {
      console.error(error)
      toast({ title: "Something went wrong", description: "Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPick = (text: string) => setValue(text)

  return (
    <Card className="mx-auto max-w-4xl rounded-[24px] border border-white/30 bg-white/25 p-5 shadow-xl ring-1 ring-black/5 backdrop-blur-xl">
      {/* Textarea with bottom-right rectangular submit */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
          placeholder="What do you want to build?"
          className="min-h-[132px] resize-none rounded-2xl border border-white/50 bg-white/60 p-4 pr-28 pb-12 text-base text-gray-800 placeholder:text-gray-500 shadow-inner focus-visible:ring-2 focus-visible:ring-violet-300"
        />
        <Button
          type="button"
          onClick={onSubmit}
          size="sm"
          disabled={isSubmitting}
          className="absolute bottom-3 right-3 h-9 rounded-lg bg-orange-400 px-3 text-white shadow-md hover:bg-orange-500 disabled:opacity-60"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Submit</span>
        </Button>
      </div>

      {/* Suggestions */}
      <div className="mt-4">
        <p className="px-1 text-xs text-gray-700">Not sure where to start? Try one of these:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              onClick={() => onPick(s)}
              className="rounded-full border border-white/50 bg-white/30 px-3 text-xs text-gray-800 backdrop-blur hover:bg-white/45 hover:text-gray-900"
              size="sm"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
