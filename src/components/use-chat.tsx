import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";

const runningChats = new Set<string>();
export function useChatSafe(options: Parameters<typeof useChat>[0] & { id: string; onFinish?: () => void }) {
  const id = options.id;
  const resume = (options as any)?.resume;

  (options as any).resume = undefined;

  const onFinish = options.onFinish;
  options.onFinish = () => {
    runningChats.delete(id);
    if (onFinish) {
      onFinish();
    }
  };

  const chat = useChat(options as any);

  useEffect(() => {
    if (!runningChats.has(id) && resume) {
      (chat as any).resumeStream?.();
      runningChats.add(id);
    }

    return () => {
      if (runningChats.has(id)) {
        (chat as any).stop?.().then(() => {
          runningChats.delete(id);
        });
      }
    };
  }, [resume, id]);

  return chat as any;
}


