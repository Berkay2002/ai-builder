declare module "ai" {
  export type UIMessage = any;
}

declare module "@ai-sdk/react" {
  export function useChat(options: any): any;
}

// Shims for Mastra and ai-sdk google when types may not be available at build time
declare module "@ai-sdk/google" {
  export function google(model: string): any;
}

declare module "@mastra/core/agent" {
  export class Agent {
    constructor(config: any);
    stream(messages: any[], options?: any): Promise<any>;
    getMemory(): Promise<any>;
  }
  export class MessageList {
    constructor(opts: any);
    add(messages: any[], type: string): void;
    drainUnsavedMessages(): any[];
  }
}

declare module "@mastra/core/tools" {
  export function createTool<TInput = any, TOutput = any>(def: any): any;
}

declare module "@mastra/memory" {
  export class Memory {
    constructor(options: any);
    saveMessages?(opts: any): Promise<void>;
    saveThread(opts: any): Promise<any>;
    getThreadById(opts: any): Promise<any>;
    getThreadsByResourceId(opts: any): Promise<any>;
    query(opts: any): Promise<any>;
  }
}

declare module "@mastra/pg" {
  export class PgVector {
    constructor(options: any);
  }
  export class PostgresStore {
    constructor(options: any);
  }
}

declare module "freestyle-sandboxes/react/dev-server" {
  export type FreestyleDevServerHandle = any;
  export const FreestyleDevServer: any;
}

declare module "@mastra/mcp" {
  export class MastraMCPClient {
    constructor(options: any);
    getToolsets(): Promise<any>;
    disconnect(): Promise<void>;
  }
}

declare module "freestyle-sandboxes" {
  export class FreestyleSandboxes {
    constructor(options: any);
    createGitIdentity: () => Promise<any>;
    createGitRepository: (opts: any) => Promise<any>;
    grantGitPermission: (opts: any) => Promise<any>;
    createGitAccessToken: (opts: any) => Promise<any>;
    deleteGitRepository: (opts: any) => Promise<any>;
    requestDevServer: (opts: any) => Promise<any>;
    deployWeb: (source: any, opts: any) => Promise<any>;
  }
  export type FreestyleDevServerFilesystem = any;
}

declare module "resumable-stream" {
  export function createResumableStreamContext(opts: any): any;
}

declare module "@/lib/internal/ai-service" {
  export class AIService {
    static sendMessage(agent: any, appId: string, mcpUrl: string, fs: any, message: any, options?: any): Promise<any>;
    static getAgent(): any;
    static getMemory(): Promise<any>;
    static getUnsavedMessages(appId: string): Promise<any[]>;
    static saveMessagesToMemory(agent: any, appId: string, messages: any[]): Promise<void>;
  }
}


