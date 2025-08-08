import { getProjectForDev } from '@/app/api/projects/route';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const project = getProjectForDev(id);
  if (!project) return Response.json({ error: 'not_found' }, { status: 404 });
  return Response.json({ id: project.id, status: project.status });
}


