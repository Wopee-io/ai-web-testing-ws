# MCPs and Skills

## What is MCP?

**MCP (Model Context Protocol)** is an open standard for connecting AI agents to external tools and data sources.

```text
AI App / Agent  ←→  MCP Client  ←→  MCP Server  ←→  External Service
```

An MCP server exposes three capabilities:

- **Tools** — functions the agent can invoke (e.g., run tests, create tickets)
- **Resources** — data the agent can query (e.g., test results, project config)
- **Prompts** — reusable prompt templates for common tasks

The MCP client is built into the agent SDK (Copilot SDK, Claude, Cursor, VS Code, etc.). The agent discovers available tools at runtime — no hardcoded integrations.

## Transports

| Type              | How it works                                           | Use case                       |
| ----------------- | ------------------------------------------------------ | ------------------------------ |
| **stdio** (local) | SDK spawns a subprocess, communicates via stdin/stdout | Local tools, CLI wrappers      |
| **SSE** (remote)  | SDK connects to HTTP endpoint with Server-Sent Events  | Cloud services, shared servers |

## What are Skills?

Skills are reusable instruction files (`SKILL.md`) that teach an agent how to perform a specific workflow efficiently. Think of them as expert knowledge packaged for AI.

We tested a custom Wopee.io skill vs unguided baseline (both using Claude Opus 4.6 + same MCP tools):

- **+26% pass rate** — skill-guided agent completed tasks correctly far more often
- **2x faster** — 52.7s avg vs 109.2s baseline (fewer exploratory tool calls)
- **-15% tokens** — less trial and error = lower cost per task

More about skills: [agentskills.io](https://agentskills.io)

## Experiments

- [Playwright MCP](./Playwright-MCP/) — Use Playwright MCP server in VS Code to test web apps
- [Wopee.io Skills](./Wopee.io-skills/) — SKILL.md for Wopee.io FoodDash testing automation

## Try It Yourself

1. Follow the [Playwright MCP experiment](./Playwright-MCP/) to set up and run MCP-powered tests in VS Code
2. Review the [Wopee.io SKILL.md](./Wopee.io-skills/SKILL.md) — understand how skills structure agent knowledge
