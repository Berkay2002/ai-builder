import { getGeminiClient } from '@/server/agent/gemini-client'
import { loadLovablePrompt, loadLovableTools } from '@/server/agent/prompt'
import { buildToolRegistry } from '@/server/agent/tools'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = (await req.json()) as { message: string }
  if (!body?.message) return Response.json({ error: 'message required' }, { status: 400 })

  // Load prompt and tools
  const systemPrompt = await loadLovablePrompt()
  const toolsSpec = await loadLovableTools()
  const tools = buildToolRegistry()

  // Minimal scaffold: echo tool list and prompt back
  // TODO: integrate Gemini 2.5 function/tool calling once available in SDK
  const ai = getGeminiClient()
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${systemPrompt}\nUser: ${body.message}`,
  })
  const text = response.text

  return Response.json({ text, tool_count: Object.keys(tools).length, tools_spec_count: Array.isArray(toolsSpec) ? toolsSpec.length : 0 })
}


