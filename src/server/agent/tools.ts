import fg from 'fast-glob'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export type Tool = {
  name: string
  description: string
  execute: (input: any) => Promise<any>
}

export function buildToolRegistry(): Record<string, Tool> {
  const tools: Record<string, Tool> = {}

  tools['search-files'] = {
    name: 'search-files',
    description: 'Regex search across files',
    async execute(input: { query: string; include_pattern?: string; exclude_pattern?: string; case_sensitive?: boolean }) {
      const include = input.include_pattern || '**/*'
      const exclude = input.exclude_pattern ? [input.exclude_pattern] : ['**/node_modules/**', '**/.next/**']
      const entries = await fg(include, { ignore: exclude })
      const re = new RegExp(input.query, input.case_sensitive ? '' : 'i')
      const matches: { file: string; lines: string[] }[] = []
      for (const file of entries) {
        const abs = path.join(process.cwd(), file)
        try {
          const text = await fs.readFile(abs, 'utf8')
          const lines = text.split('\n').filter((l) => re.test(l))
          if (lines.length) matches.push({ file, lines })
        } catch {}
      }
      return matches
    },
  }

  tools['read-file'] = {
    name: 'read-file',
    description: 'Read file contents',
    async execute(input: { file_path: string }) {
      const abs = path.join(process.cwd(), input.file_path)
      return fs.readFile(abs, 'utf8')
    },
  }

  tools['write-file'] = {
    name: 'write-file',
    description: 'Write file contents (overwrite)',
    async execute(input: { file_path: string; content: string }) {
      const abs = path.join(process.cwd(), input.file_path)
      await fs.mkdir(path.dirname(abs), { recursive: true })
      await fs.writeFile(abs, input.content, 'utf8')
      return { ok: true }
    },
  }

  return tools
}


