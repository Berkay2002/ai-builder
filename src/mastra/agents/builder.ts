import { SYSTEM_MESSAGE } from "@/lib/system";
import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

import { PostgresStore, PgVector } from "@mastra/pg";
import { todoTool } from "@/tools/todo-tool";
import { websitePlanTool } from "@/tools/website-tool";

export const memory = new Memory({
  options: { lastMessages: 1000, semanticRecall: false, threads: { generateTitle: true } },
  vector: new PgVector({ connectionString: process.env.DATABASE_URL! }),
  storage: new PostgresStore({ connectionString: process.env.DATABASE_URL! }),
  processors: [],
});

export const builderAgent = new Agent({
  name: "BuilderAgent",
  model: google('gemini-2.5-flash'),
  instructions: SYSTEM_MESSAGE,
  memory,
  tools: { update_todo_list: todoTool, build_website_plan: websitePlanTool },
});


