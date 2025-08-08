import { createProject } from './dev-store';

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
  return Response.json({ id: record.id, status: record.status });
}

