import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { Manifest, ManifestSchema } from './schema'

const pExecFile = promisify(execFile)

export type OrchestratorResult = {
  ok: boolean
  manifestSha?: string
  logs: string[]
}

export async function runGenerationPipeline(manifestPath: string): Promise<OrchestratorResult> {
  const logs: string[] = []
  try {
    const raw = await readFile(manifestPath, 'utf8')
    const parsed = JSON.parse(raw)
    const manifest = ManifestSchema.parse(parsed) as Manifest

    const sha = createHash('sha256').update(JSON.stringify(manifest)).digest('hex')
    logs.push(`manifest_sha=${sha}`)

    // 1) Parameterize repo from manifest
    const transformScript = path.join(process.cwd(), 'generator', 'transform.js')
    const { stdout: tOut, stderr: tErr } = await pExecFile('node', [transformScript, '--manifest', manifestPath], {
      windowsHide: true,
    })
    if (tOut) logs.push(tOut)
    if (tErr) logs.push(tErr)

    // 2) Run CI checks
    const checksScript = path.join(process.cwd(), 'ci', 'checks.sh')
    const { stdout: cOut, stderr: cErr } = await pExecFile(process.platform === 'win32' ? 'bash' : 'sh', [checksScript], {
      windowsHide: true,
    })
    if (cOut) logs.push(cOut)
    if (cErr) logs.push(cErr)

    return { ok: true, manifestSha: sha, logs }
  } catch (err: any) {
    logs.push(`error=${err?.message ?? String(err)}`)
    return { ok: false, logs }
  }
}


