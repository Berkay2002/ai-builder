import { randomUUID } from 'crypto';

export type ProjectStatus =
  | 'queued'
  | 'planning'
  | 'manifest_ready'
  | 'generating_files'
  | 'building'
  | 'testing'
  | 'preview_ready'
  | 'failed';

export type ProjectRecord = {
  id: string;
  prompt: string;
  templateId?: string;
  status: ProjectStatus;
  createdAt: number;
};

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

export function createProject(prompt: string, templateId?: string): ProjectRecord {
  const id = randomUUID();
  const record: ProjectRecord = {
    id,
    prompt,
    templateId,
    status: 'queued',
    createdAt: Date.now(),
  };
  projectStore.set(id, record);
  scheduleDevJobProgress(id);
  return record;
}

export function getProjectForDev(projectId: string) {
  return projectStore.get(projectId);
}


