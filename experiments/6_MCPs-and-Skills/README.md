# Intro to MCP

**MCP (Model Context Protocol)** is an open standard for connecting AI agents to external tools and data sources.

## What is MCP?

Instead of building custom tools for each integration, MCP provides a universal protocol:

```
Agent  ←→  MCP Client  ←→  MCP Server  ←→  External Service
```

- **MCP Server** = a wrapper around an external service (Jira, Wopee, GitHub, etc.)
- **MCP Client** = built into the agent SDK (Copilot SDK, Claude, Cursor, etc.)
- The agent discovers available tools at runtime — no hardcoded integrations

## Transports

| Type | How it works | Use case |
|------|-------------|----------|
| **stdio** (local) | SDK spawns a subprocess, communicates via stdin/stdout | Local tools, CLI wrappers |
| **SSE** (remote) | SDK connects to HTTP endpoint with Server-Sent Events | Cloud services, shared servers |

## Experiments

- [2-GitHubCopilotAgent](./2-GitHubCopilotAgent/) — Copilot SDK agent with Wopee.io + Atlassian MCP servers
