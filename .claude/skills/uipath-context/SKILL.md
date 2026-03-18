---
name: uipath-context
description: This skill should be used when the user is working on UiPath agents, agentic processes, agent builder, UiPath Studio, UiPath Orchestrator, or anything related to UiPath automation. Also activates when the user asks about "agents", "agentic process", "BPMN", "process canvas", "orchestration", or UiPath-specific topics in this project.
version: 1.0.0
---

# UiPath Agent Context Skill

This skill provides deep context about UiPath's agentic platform and guides Claude to fetch fresh documentation when working on UiPath-related features in this project.

## Project Context

This project (`/Users/prabhatkumar/Code/Agent`) is building a **UiPath Agent Builder** — a visual tool that allows users to design agentic processes using a BPMN-style canvas. The agent-builder is a Next.js + React Flow application that models how UiPath Agents are composed, orchestrated, and connected.

Key subprojects:
- `agent-builder/` — Main Next.js app with BPMN process canvas (React Flow + Zustand)
- `uipath-studio/` — UiPath Studio integration prototype (state management, store)

## UiPath Agent Concepts

### What are UiPath Agents?
UiPath Agents are AI-powered automation workers that can:
- Execute RPA (Robotic Process Automation) workflows
- Use LLMs/GenAI for decision-making mid-process
- Be orchestrated via UiPath Orchestrator
- Operate in attended or unattended modes
- Communicate with other agents (multi-agent orchestration)

### Agentic Process
An **Agentic Process** in UiPath is a workflow where:
- Multiple agents collaborate to complete a task
- Human-in-the-loop steps can be included
- Agents can invoke other agents or RPA bots
- The process is defined declaratively (BPMN-like)

### Key UiPath Platform Components
- **UiPath Orchestrator** — Central hub for deploying, monitoring, scheduling agents/bots
- **UiPath Studio** — IDE for building automation workflows (XAML-based)
- **UiPath Agent Builder** — New visual tool for designing multi-agent pipelines
- **Action Center** — Human task inbox for attended automation approvals
- **Process Mining** — Discover automation candidates from process logs
- **UiPath Autopilot** — AI assistant embedded across UiPath products

### Agent Types in UiPath
1. **Task Agents** — Execute a specific RPA task/workflow
2. **Orchestrator Agents** — Coordinate other agents/tasks
3. **Conversational Agents** — Handle chat-based interactions
4. **Process Agents** — Own an end-to-end business process

### BPMN Canvas Design
The agent-builder uses a BPMN (Business Process Model and Notation) style canvas where:
- **Agent Node** — Represents a UiPath Agent (start point)
- **Context Node** — Provides data/context to agents
- **Process Node** — Represents a step in the agentic process
- **Decision Node** — Branching logic
- **Human Task Node** — Manual approval/input step
- **End Node** — Process termination

## When to Fetch Fresh Docs

When the user asks about a specific UiPath feature, API, or concept, use `WebFetch` to get the latest documentation:

### Key UiPath Documentation URLs
- Agents overview: `https://docs.uipath.com/orchestrator/automation-cloud/latest/user-guide/about-agents`
- Agentic automation: `https://docs.uipath.com/ai-center/automation-cloud/latest/user-guide/agentic-automation`
- Agent Builder: `https://docs.uipath.com/agent-builder/automation-cloud/latest/user-guide/about-agent-builder`
- Orchestrator API: `https://docs.uipath.com/orchestrator/reference/api-references`
- Studio activities: `https://docs.uipath.com/activities/other/latest/`

**Always fetch docs when:**
- User asks how a UiPath feature works
- Implementing an integration with UiPath APIs
- Unsure about UiPath-specific terminology or constraints
- User asks you to sync or update UiPath context

## When to Fetch Confluence Pages

When the user provides a Confluence URL (e.g., `https://*.atlassian.net/wiki/...`):
1. Use the `mcp__claude_ai_Atlassian__getConfluencePage` tool if the page ID is available
2. Or use `mcp__claude_ai_Atlassian__searchConfluenceUsingCql` to search for the content
3. Or use `WebFetch` to fetch the page directly
4. Save the key information to memory as a `project` memory type

**Always ask the user if they want the fetched content saved to memory for future sessions.**

## Guidance for This Project

When working in this codebase:

1. **React Flow patterns**: The canvas uses React Flow v11+. Nodes are stored in Zustand. Custom node types are in `agent-builder/app/components/`.

2. **Node design philosophy**: Each node type should map to a real UiPath concept. Don't invent node types that don't exist in UiPath's model.

3. **State management**: Uses Zustand store. The store shape mirrors UiPath's process definition model.

4. **API integration**: When implementing UiPath API calls, always check Orchestrator API docs first.

5. **Agentic process design**: The canvas should enable users to define how agents hand off tasks, what context they receive, and how decisions are made.
