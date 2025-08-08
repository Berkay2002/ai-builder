import { getProjectForDev } from '@/app/api/projects/route';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const project = getProjectForDev(params.id);
  if (!project) return Response.json({ error: 'not_found' }, { status: 404 });
  return Response.json({ id: project.id, status: project.status });
}


