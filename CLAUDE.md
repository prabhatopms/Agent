# Agent Builder — Claude Context

This project builds a **UiPath Agent Builder**: a visual BPMN-style canvas for designing multi-agent agentic processes on the UiPath platform.

## Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Canvas**: React Flow v11, Zustand for state
- **UI**: shadcn/ui components
- **Platform target**: UiPath Automation Cloud

## Key Directories
- `agent-builder/` — Main Next.js application
- `agent-builder/app/components/` — React components including canvas nodes
- `uipath-studio/` — UiPath Studio integration (state/store experiments)

## Active Skill
The `uipath-context` skill is always active in this project. It provides:
- UiPath platform knowledge
- Node type definitions that map to real UiPath concepts
- Guidance on when to fetch live UiPath docs

## Commands
- `/sync-uipath-docs` — Fetch latest UiPath docs and/or a Confluence page
  - Usage: `/sync-uipath-docs` (fetches core agent docs)
  - Usage: `/sync-uipath-docs https://your-company.atlassian.net/wiki/...` (fetches Confluence page)
  - Usage: `/sync-uipath-docs agent builder` (fetches docs for that topic)

## Design Principles
1. Every canvas node type must map to a real UiPath concept
2. The canvas output should be exportable as a UiPath-compatible process definition
3. State shape in Zustand mirrors UiPath's process definition model
