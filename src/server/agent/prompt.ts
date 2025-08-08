import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function loadLovablePrompt(): Promise<string> {
  const promptPath = path.join(process.cwd(), 'docs', 'lovable', 'agent_prompt.txt')
  return readFile(promptPath, 'utf8')
}

export async function loadLovableTools(): Promise<any> {
  const toolsPath = path.join(process.cwd(), 'docs', 'lovable', 'agent_tools.json')
  const raw = await readFile(toolsPath, 'utf8')
  return JSON.parse(raw)
}


