# Experiment 6.6: YouTrack MCP

Connect an AI agent to **YouTrack** (JetBrains issue tracker) over MCP — read issues, create tickets, and comment results straight from VS Code Chat.

Official docs: [YouTrack MCP server](https://www.jetbrains.com/help/youtrack/server/model-context-protocol-server.html)

## Setup

### 1. Get your MCP endpoint URL

Append `/mcp` to your YouTrack base URL:

- Cloud: `https://<your-instance>.youtrack.cloud/mcp`
- Server: `https://youtrack.mycompany.com/mcp`

> Works with YouTrack Cloud and YouTrack Server. If your instance has automatic OAuth client registration enabled and your client supports it, the endpoint URL alone is enough — no token needed. This experiment uses the token flow, which works everywhere.

### 2. Create a permanent token

In YouTrack: **Profile** (avatar, top right) -> **Account Security** -> **New token...**

1. Enter any token name
2. Select **YouTrack** as the scope
3. Add **YouTrack Administration** only if you need admin-level actions
4. Click **Create** and copy the token value (`perm:...`).

The MCP server acts with **your** permissions — the agent sees exactly the projects and issues you can see.

### 3. Put the token in `.env`

Copy `.env.example` to `.env` (if you have not already) and set:

```bash
YOUTRACK_AUTH_HEADER="Bearer perm:your-token-here"
```

`.env` is git-ignored — never commit the token.

### 4. Point the MCP config at your instance

This workshop repo ships [`.vscode/mcp.json`](../../../.vscode/mcp.json), [`.cursor/mcp.json`](../../../.cursor/mcp.json), and [`.mcp.json`](../../../.mcp.json) preconfigured for `https://wopee.youtrack.cloud/mcp`.

If you use a different YouTrack instance, replace that default host with your own. Generic example:

```json
{
  "youtrack": {
    "command": "npx",
    "args": [
      "mcp-remote",
      "https://YOUR-INSTANCE.youtrack.cloud/mcp",
      "--header",
      "Authorization:${YOUTRACK_AUTH_HEADER}"
    ],
    "envFile": "${workspaceFolder}/.env"
  }
}
```

`mcp-remote` is a small proxy that bridges the remote HTTP MCP server to the local stdio transport your editor expects. `npx` downloads it on first run — no install needed.

> **Note:** keep the header exactly as shown — no space after `Authorization:`. Some clients split argument strings on spaces, which produces a malformed header.

### 5. Start the server

In VS Code open `.vscode/mcp.json` and click **Start** above the `youtrack` entry (or `Cmd/Ctrl + Shift + P` → **MCP: List Servers** → `youtrack` → **Start Server**). In Cursor: **Settings → MCP → Refresh**.

### 6. Verify

Open VS Code Chat (`Cmd + Shift + I` / `Ctrl + Shift + I`), switch to **Agent mode**, and ask:

```text
Using the YouTrack MCP, call get_current_user and list my projects.
```

You should get your YouTrack account name and the projects you have access to. If not, see [Troubleshooting](#troubleshooting).

## Available Tools

The YouTrack MCP server exposes 23 tools (verified against YouTrack MCP 2026.2). The ones relevant to this experiment — note that `find_projects` takes a search `query` argument (empty string lists all), and `get_issue_fields_schema` wants `projectKey`:

| Area       | Tools                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| Issues     | `search_issues`, `get_issue`, `create_issue`, `update_issue`, `add_issue_comment`, `get_issue_comments` |
| Issue meta | `get_issue_fields_schema`, `change_issue_assignee`, `manage_issue_tags`, `link_issues`                  |
| Projects   | `find_projects`, `get_project`                                                                          |
| Users      | `get_current_user`, `find_user`                                                                         |
| Articles   | `search_articles`, `get_article`, `create_article`, `update_article`                                    |

## Try It Yourself

1. Verify the connection with the prompt in step 6 above
2. Copy & paste [`1.bug-triage.prompt.md`](./1.bug-triage.prompt.md) into VS Code Chat — the agent triages your project's open bugs
3. Copy & paste [`2.test-and-report.prompt.md`](./2.test-and-report.prompt.md) — the agent runs a quick test with Playwright MCP and files the result as a YouTrack issue
4. Copy & paste [`3.executive-summary.prompt.md`](./3.executive-summary.prompt.md) — the agent fetches live project data over MCP and turns it into a one-page executive quality report (great for demos)
5. Add the [`SKILL.md`](./SKILL.md) to your agent's context and re-run prompt 2 — compare the issue quality with and without the skill
6. **Challenge:** chain it with Wopee.io MCP — fetch a failing visual test, then open a YouTrack bug with the screenshot link attached

## Troubleshooting

| Symptom                              | Fix                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `401 Unauthorized`                   | Token missing/expired, or the `.env` value lacks the `Bearer` prefix                           |
| `404 Not Found`                      | URL must end with `/mcp`; check the instance host                                              |
| Server starts but exposes no tools   | YouTrack version too old, or the MCP server is disabled by the admin — ask your YouTrack admin |
| Token not picked up                  | Quote the `.env` value if it has spaces; ensure `envFile` resolves from the repo root          |
| Stale credentials after token change | Clear the proxy cache: `rm -rf ~/.mcp-auth`, then restart the server                           |
