# Experiment 6.3: MCP Testing Team

Combine **three MCP servers** (Atlassian, Wopee.io, Playwright) to orchestrate a full testing workflow — from Jira bug to test report — using a single prompt in VS Code Chat.

## How It Works

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Atlassian   │     │  Wopee.io    │     │  Playwright   │
│  MCP Server  │     │  MCP Server  │     │  MCP Server   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ Read issues  │     │ Fetch tests  │     │ Run tests    │
│ Update status│     │ Find suites  │     │ Take shots   │
│ Add comments │     │ Prioritize   │     │ Navigate     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       └────────────────────┼────────────────────┘
                            ▼
                   AI Agent (VS Code Chat)
```

## Two Prompts, Two Levels

### 1. Test Analyst (`test-analyst.prompt.md`)

Reads a Jira issue → finds relevant tests in Wopee.io → prepares a prioritized test plan → comments it back to Jira.

**MCP servers used:** Atlassian + Wopee.io

### 2. Testing Team (`testing-team.prompt.md`)

Everything the Test Analyst does, **plus** executes the top 3 tests using Playwright MCP and writes a detailed test report back to Jira.

**MCP servers used:** Atlassian + Wopee.io + Playwright

## Prerequisites

- VS Code with GitHub Copilot (Agent mode enabled)
- MCP servers configured (see `.cursor/mcp.json` or `.vscode/mcp.json` in project root)
- `.env` file with `WOPEE_API_KEY` and `WOPEE_PROJECT_UUID`
- Atlassian MCP authenticated (SSE transport, browser-based auth)

## Try It Yourself

1. Open VS Code Chat (`Cmd+Shift+I`)
2. Copy & paste `test-analyst.prompt.md` into the chat
3. When prompted, provide a Jira issue ID (e.g., `DEMO-123`)
4. Watch the agent fetch the bug, find tests, and comment a test plan to Jira
5. Now try `testing-team.prompt.md` — the full workflow with test execution and reporting
6. Compare: what did the Test Analyst produce vs. the full Testing Team?
