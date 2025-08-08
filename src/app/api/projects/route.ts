import { createProject } from './dev-store';
import { runGenerationPipeline } from '@/server/orchestrator/runner';
import path from 'node:path';

type CreateProjectRequest = {
  prompt: string;
  template_id?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as CreateProjectRequest;
  if (!body?.prompt || typeof body.prompt !== 'string') {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }

  const record = createProject(body.prompt, body.template_id);

  // Fire-and-forget: kick off pipeline against example manifest
  // In a real system, this would use the user's manifest payload
  const manifestPath = path.join(process.cwd(), 'generator', 'example-manifests', 'saas.json');
  runGenerationPipeline(manifestPath).then((res) => {
    console.log('[pipeline]', res.ok ? 'ok' : 'fail');
  });

  return Response.json({ id: record.id, status: record.status });
}

