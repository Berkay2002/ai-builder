# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev                 # Start Next.js dev server with Turbopack
npm run build              # Build production app
npm run lint               # Run Next.js linter
npm run ci:checks          # Run CI validation (lint, build, typecheck)
```

### Database Operations
```bash
npm run generate-types     # Generate Supabase types from database schema
npm run migration:new      # Create new Supabase migration
npm run migration:up       # Run migrations and regenerate types
npm run migration:squash   # Squash migrations
```

### Email Development
```bash
npm run email:dev          # Start email development server on port 3001
npm run email:build        # Build email templates
npm run email:export       # Export email templates
```

### Generation Pipeline
```bash
npm run generator:transform # Transform manifest into project files
npm run preview:container   # Build and run Docker preview container
```

### Testing Commands
```bash
npx tsc -p tsconfig.json --noEmit  # Type checking
sh ./ci/checks.sh                  # Full CI validation pipeline
```

## Architecture Overview

This is an AI-first app generator that converts natural language prompts into deployable Next.js applications. The system follows a manifest-driven architecture with multiple generation stages.

### Core Components

1. **Frontend (Next.js)** - Chat interface, preview iframe, export functionality
2. **Mastra Agent System** - AI agent using Gemini 2.5 Flash with persistent memory
3. **Generation Pipeline** - Multi-stage manifest → files transformation
4. **Orchestrator** - Coordinates generation, validation, and deployment
5. **Database** - PostgreSQL with Drizzle ORM for app metadata and messages

### Key Directories

- `src/mastra/` - Mastra agent configuration and tools
- `src/server/orchestrator/` - Generation pipeline runner
- `generator/` - Manifest transformation scripts and schemas
- `src/db/` - Database schema and connections
- `ci/` - Build validation scripts
- `docs/` - Architecture documentation and PRD

### Generation Flow

1. User prompt → Mastra Agent (Gemini 2.5 Flash)
2. Agent creates structured manifest using tools
3. Orchestrator validates manifest against JSON schema
4. Transform script generates project files from manifest
5. CI checks run (install, lint, build, typecheck)
6. Preview container serves live application

## Database Schema

Uses Drizzle ORM with PostgreSQL:
- `apps` - Application metadata and git repos
- `app_users` - User permissions and Freestyle tokens
- `messages` - Chat message history with AI agent
- `app_deployments` - Deployment tracking

## Environment Setup

Copy `env.template` to `.env.local` and configure:
- Supabase (database, auth)
- Stripe (billing)
- Gemini API (AI generation)
- Resend (email)

## AI Agent Configuration

The `builderAgent` uses:
- Google Gemini 2.5 Flash model
- Mastra framework with persistent memory
- PostgreSQL vector storage for semantic recall
- Custom tools: `todoTool` and `websitePlanTool`

## Generation Pipeline Details

### Manifest Schema
The system validates all generations against `generator/manifest.schema.json`:
- `app_name`, `pages` (required)
- `entities` (database models)
- `integrations` (Supabase, Stripe, etc.)

### Transform Process
`generator/transform.js` converts manifest → project files:
- Reads manifest JSON
- Applies template transformations
- Generates Next.js + TypeScript + Tailwind code
- Uses guardrails from `generator/guardrails.json`

### CI Validation
`ci/checks.sh` runs validation pipeline:
1. `npm ci` - Clean dependency install
2. `npm run lint` - ESLint validation
3. `npm run build` - Production build
4. `npx tsc --noEmit` - TypeScript checking

## Stack Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui, Lucide React
- **AI**: Mastra framework, Google Gemini, AI SDK
- **Database**: PostgreSQL, Drizzle ORM, Supabase
- **Auth**: Stack Auth, Supabase Auth
- **Payments**: Stripe
- **Email**: React Email, Resend
- **Containerization**: Docker for preview environments

## Code Conventions

- Use TypeScript for all source files
- Follow Next.js App Router patterns
- Database operations through Drizzle ORM
- AI interactions through Mastra Agent framework
- UI components from shadcn/ui library
- Path aliases: `@/*` maps to `./src/*`

## MCP Integration

Cursor IDE configured with Mastra MCP server:
```json
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

## Security Notes

- Never commit API keys or secrets
- Preview containers run in isolated environments
- Database credentials use environment variables
- Stripe webhooks require signature verification
- Supabase RLS policies control data access