import { builderAgent } from '@/mastra/agents/builder'
import { freestyle } from '@/lib/freestyle'
import { sendMessageWithStreaming } from '@/lib/internal/stream-manager'
import { UIMessage } from 'ai'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const appId = req.headers.get('Novu-App-Id') || 'default';
  const body = (await req.json()) as { message: string };
  if (!body?.message) return Response.json({ error: 'message required' }, { status: 400 });

  const { fs, mcpEphemeralUrl } = await freestyle.requestDevServer({ repoId: appId });

  const uiMessage: UIMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [{ type: 'text', text: body.message }],
  } as any;

  const stream = await sendMessageWithStreaming(builderAgent, appId, mcpEphemeralUrl, fs, uiMessage);
  return stream.response();
}


