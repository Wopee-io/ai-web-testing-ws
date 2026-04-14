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

Learn more:

- [agentskills.io](https://agentskills.io) — open skill format and registry
- [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) (PDF)
- [Building Skills for Claude — video walkthrough](https://www.youtube.com/watch?v=6-D3fg3JUL4&t=83s) (YouTube)

## Future: AI Testing Teams with MCPs

With multiple MCPs connected, a single agent can orchestrate a full testing workflow:

```text
Jira (Atlassian MCP)  →  Wopee.io (Wopee MCP)  →  Browser (Playwright MCP)
     │                         │                          │
  Fetch bug              Find/create tests          Execute tests
     │                         │                          │
     └─── Prepare test plan ───┴──── Report results ──────┘
                        (comment back to Jira)
```

This works today — see the [Copilot + MCP agent](../4_AI-Agents/3-GitHubCopilotAgent/) and the [skill evaluation report](./2-WopeeSkill/EVAL_REPORT.md).

## Experiments

- [6.1 Playwright MCP](./1-PlaywrightMCP/) — Use Playwright MCP server in VS Code to test web apps
- [6.2 Wopee.io Skill](./2-WopeeSkill/) — SKILL.md for Wopee.io FoodDash testing automation
- [6.3 MCP Testing Team](./3-MCPTestingTeam/) — Combine Jira + Wopee.io + Playwright MCPs into a full testing workflow
- [6.4 AIO Tests Skill](./4-AIOTestsSkill/) — SKILL.md for AIO Tests (Jira plugin) — fetch, create, update test cases via REST API
- [6.5 Issue Reporting Skill](./5-IssueReportingSkill/) — SKILL.md for structured GitHub issue creation — title conventions, body templates, labels, agent workflow

## Try It Yourself

1. **Playwright MCP** — follow [6.1](./1-PlaywrightMCP/) to set up Playwright MCP in VS Code and run test prompts
2. **Skills** — review the [Wopee.io SKILL.md](./2-WopeeSkill/SKILL.md) and [evaluation report](./2-WopeeSkill/EVAL_REPORT.md) — understand how skills improve agent performance (+26% pass rate, 2x faster)
3. **MCP Testing Team** — follow [6.3](./3-MCPTestingTeam/) to run the test-analyst and testing-team prompts combining Jira + Wopee.io + Playwright
4. **Explore skill examples** — compare the [AIO Tests](./4-AIOTestsSkill/SKILL.md) and [Issue Reporting](./5-IssueReportingSkill/SKILL.md) skills — notice how each skill structures domain knowledge differently (API reference vs conventions & templates)
5. **Write your own skill** — pick a workflow your team does repeatedly and draft a SKILL.md for it
