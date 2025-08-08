import { randomUUID } from 'crypto';

type CreateProjectRequest = {
  prompt: string;
  template_id?: string;
};

export type ProjectStatus =
  | 'queued'
  | 'planning'
  | 'manifest_ready'
  | 'generating_files'
  | 'building'
  | 'testing'
  | 'preview_ready'
  | 'failed';

type ProjectRecord = {
  id: string;
  prompt: string;
  templateId?: string;
  status: ProjectStatus;
  createdAt: number;
};

// In-memory dev store; replace with Supabase in production
const projectStore = new Map<string, ProjectRecord>();

function scheduleDevJobProgress(projectId: string) {
  const steps: ProjectStatus[] = [
    'planning',
    'manifest_ready',
    'generating_files',
    'building',
    'testing',
    'preview_ready',
  ];
  let idx = 0;
  const tick = () => {
    const rec = projectStore.get(projectId);
    if (!rec) return;
    if (idx >= steps.length) return;
    rec.status = steps[idx++];
    projectStore.set(projectId, rec);
    if (rec.status !== 'preview_ready') setTimeout(tick, 400);
  };
  setTimeout(tick, 400);
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateProjectRequest;
  if (!body?.prompt || typeof body.prompt !== 'string') {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }

  const id = randomUUID();
  const record: ProjectRecord = {
    id,
    prompt: body.prompt,
    templateId: body.template_id,
    status: 'queued',
    createdAt: Date.now(),
  };
  projectStore.set(id, record);
  scheduleDevJobProgress(id);

  return Response.json({ id, status: record.status });
}

export function getProjectForDev(projectId: string) {
  return projectStore.get(projectId);
}


