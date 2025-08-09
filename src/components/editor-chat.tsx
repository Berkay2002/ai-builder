"use client"

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

export default function EditorChat({ appId }: { appId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Plan\n\n1. Core Calculator Functions: Basic arithmetic operations (add, subtract, multiply, divide), clear, and equals\n\n2. Advanced Features: Decimal support, keyboard input, and error handling for division by zero\n\n3. Design Language: Ultra-clean, minimalist design with a sophisticated color palette using deep blues and whites, smooth animations, and premium typography\n\n4. App Organization: Single calculator page as the main interface...'
    },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    // Placeholder echo assistant for now
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Noted. I will update the plan accordingly.' },
      ])
    }, 400)
  }

  return (
    <aside className="flex h-full flex-col rounded-xl border bg-white/70">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="text-sm font-semibold text-gray-700">Create Beautiful Calculator App</div>
        <div className="text-xs text-gray-500">App: {appId.slice(0, 6)}</div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-gray-800' : 'text-gray-600'}>
            {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t p-3">
        <Textarea
          placeholder="What would you like to change?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[70px]"
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </aside>
  )
}


