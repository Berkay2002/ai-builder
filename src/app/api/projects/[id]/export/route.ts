export async function POST(_req: Request, { params }: { params: { id: string } }) {
  // Placeholder export endpoint
  return Response.json({ id: params.id, queued: true });
}


