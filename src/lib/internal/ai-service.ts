import { UIMessage } from "ai";
import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { MessageList } from "@mastra/core/agent";
import { builderAgent } from "@/mastra/agents/builder";
import { morphTool } from "@/tools/morph-tool";
import { FreestyleDevServerFilesystem } from "freestyle-sandboxes";

export interface AIStreamOptions {
  threadId: string;
  resourceId: string;
  maxSteps?: number;
  maxRetries?: number;
  maxOutputTokens?: number;
  onChunk?: () => void;
  onStepFinish?: (step: { response: { messages: unknown[] } }) => void;
  onError?: (error: { error: unknown }) => void;
  onFinish?: () => void;
  abortSignal?: AbortSignal;
}

export interface AIResponse {
  stream: {
    toUIMessageStreamResponse: () => {
      body?: ReadableStream<Uint8Array> | null;
    };
  };
}

export class AIService {
  static async sendMessage(
    agent: Agent,
    appId: string,
    mcpUrl: string,
    fs: FreestyleDevServerFilesystem,
    message: UIMessage,
    options?: Partial<AIStreamOptions>,
  ): Promise<AIResponse> {
    const mcp = new MCPClient({ id: crypto.randomUUID(), servers: { dev_server: { url: new URL(mcpUrl) } } });
    const freestyleToolsets = await mcp.getToolsets();

    const memory = await agent.getMemory();
    if (memory) {
      await memory.saveMessages({
        messages: [
          {
            content: { parts: message.parts, format: 3 },
            role: "user",
            createdAt: new Date(),
            id: message.id,
            threadId: appId,
            type: "text",
            resourceId: appId,
          },
        ],
      });
    }

    const messageList = new MessageList({ resourceId: appId, threadId: appId });

    const stream = await agent.stream([], {
      threadId: appId,
      resourceId: appId,
      maxSteps: options?.maxSteps ?? 100,
      maxRetries: options?.maxRetries ?? 0,
      maxOutputTokens: options?.maxOutputTokens ?? 64000,
      toolsets: {
        ...(process.env.MORPH_API_KEY
          ? {
              morph: {
                edit_file: morphTool(fs),
              },
            }
          : {}),
        ...freestyleToolsets,
      },
      async onChunk() {
        options?.onChunk?.();
      },
      async onStepFinish(step: { response: { messages: unknown[] } }) {
        messageList.add(step.response.messages as any, "response");
        options?.onStepFinish?.(step);
      },
      onError: async (error: { error: unknown }) => {
        await mcp.disconnect();
        options?.onError?.(error);
      },
      onFinish: async () => {
        await mcp.disconnect();
        options?.onFinish?.();
      },
      abortSignal: options?.abortSignal,
    });

    if (!stream.toUIMessageStreamResponse) {
      console.error("Stream does not have toUIMessageStreamResponse method:", stream);
      throw new Error("Invalid stream format - missing toUIMessageStreamResponse method");
    }

    return { stream };
  }

  static getAgent() {
    return builderAgent;
  }

  static async getMemory() {
    return await builderAgent.getMemory();
  }

  static async getUnsavedMessages(appId: string): Promise<unknown[]> {
    const messageList = new MessageList({ resourceId: appId, threadId: appId });
    return messageList.drainUnsavedMessages();
  }

  static async saveMessagesToMemory(agent: Agent, appId: string, messages: unknown[]): Promise<void> {
    const memory = await agent.getMemory();
    if (memory) {
      await memory.saveMessages({ messages: messages as any });
    }
  }
}


