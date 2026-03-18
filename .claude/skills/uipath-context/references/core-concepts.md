# UiPath Core Concepts Reference

_Static reference — for live updates use `/sync-uipath-docs`_

## UiPath Agent Platform Architecture

```
┌─────────────────────────────────────────────┐
│              UiPath Platform                │
│                                             │
│  ┌──────────┐    ┌──────────────────────┐  │
│  │  Studio  │    │     Orchestrator     │  │
│  │  (IDE)   │───▶│  (Deploy/Monitor)    │  │
│  └──────────┘    └──────────┬───────────┘  │
│                             │              │
│         ┌───────────────────┼──────────┐  │
│         ▼                   ▼          ▼  │
│    ┌─────────┐        ┌─────────┐ ┌──────┐│
│    │ Agent 1 │        │ Agent 2 │ │ Bot  ││
│    │ (LLM)   │◀──────▶│ (RPA)   │ │(RPA) ││
│    └─────────┘        └─────────┘ └──────┘│
└─────────────────────────────────────────────┘
```

## Agentic Process Flow

An agentic process defines how agents coordinate:

1. **Trigger** — Event or schedule starts the process
2. **Context Injection** — Relevant data passed to the lead agent
3. **Agent Execution** — Lead agent processes, may delegate
4. **Human Handoff** (optional) — Approval or input required
5. **Sub-agent Invocation** — Specialized agents handle subtasks
6. **Result Aggregation** — Outputs combined
7. **Process Completion** — Result returned or stored

## Node Types in Agent Builder Canvas

| Node Type | UiPath Concept | Description |
|-----------|---------------|-------------|
| Agent | UiPath Agent | AI-powered worker that executes tasks |
| Context | Context Object | Data/documents passed to agent |
| Process | Workflow Step | An RPA workflow or automation step |
| Decision | Gateway | Conditional branching based on agent output |
| Human Task | Action Center Task | Manual review/approval step |
| Connector | Process Link | Data flow between nodes |

## UiPath API Key Endpoints

### Orchestrator REST API
- `GET /odata/Agents` — List all agents
- `POST /odata/Agents` — Create agent
- `GET /odata/Jobs` — List running jobs
- `POST /odata/Jobs/UiPath.Server.Configuration.OData.StartJobs` — Start a job
- `GET /odata/Processes` — List automation processes

### Authentication
- OAuth2 with UiPath Cloud credentials
- Client credentials flow for machine-to-machine
- User token flow for user-facing apps

## Terminology Mapping (UiPath → This Project)

| UiPath Term | Project Term | Notes |
|-------------|-------------|-------|
| Agent | Agent Node | Core entity in canvas |
| Process | Workflow / Process Node | Automation steps |
| Job | Execution | Runtime instance |
| Package | Automation Package | Deployed workflow |
| Tenant | Workspace | Org-level isolation |
| Folder | Project Space | Team-level isolation |

## Key UiPath Agent Features (as of 2025)

- **Autopilot**: AI assistant across UiPath products
- **Long-running agents**: Agents that persist state across days/weeks
- **Context grounding**: Agents can be given documents, databases as context
- **Agent chaining**: Output of one agent feeds into another
- **Human-in-the-loop**: Pause agent execution for human approval
- **Audit trail**: Every agent decision logged for compliance
