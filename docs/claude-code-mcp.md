# Claude Code MCP setup

[Claude Code](https://claude.com/claude-code) is an optional alternative to GitHub Copilot for the workshop exercises. This repo ships a project-scoped config, `.mcp.json`, with the same servers as `.vscode/mcp.json` and `.cursor/mcp.json`:

| Server       | Transport                                | Used by                  |
| ------------ | ---------------------------------------- | ------------------------ |
| `playwright` | stdio — `npx @playwright/mcp@latest`     | experiment 6.1           |
| `atlassian`  | SSE — `https://mcp.atlassian.com/v1/sse` | experiment 6.3           |
| `wopee`      | stdio — `npx wopee-mcp@latest`           | experiments 6.2, 6.3     |
| `youtrack`   | stdio — `npx mcp-remote`                 | experiment 6.6, optional |

## Quick start

1. Install the Claude Code CLI so the `claude` command is available
2. Fill in your `.env` (copied from `.env.example`) — at minimum the Wopee variables
3. Start Claude Code:

   ```bash
   npm run claude:mcp
   ```

4. Inside Claude Code, run `/mcp` to check the servers are connected, and authenticate `atlassian` if prompted

## Start it with `npm run claude:mcp`, not a bare `claude`

Claude Code does not read `.env`. It expands `${...}` in `.mcp.json` from the **process environment** only, and `.mcp.json` has no `envFile` field like the VS Code config does. Launched with a bare `claude`, every server starts with empty credentials — `wopee` as well as `youtrack`.

`npm run claude:mcp` runs `dotenv -e .env -- claude`, which loads `.env` first.

## YouTrack (experiment 6.6)

For this workshop repo, `.mcp.json` already points at `https://wopee.youtrack.cloud/mcp`.

1. Create a permanent token in YouTrack: **Profile** -> **Account Security** -> **New token...**
2. Give it any name, then select **YouTrack** as the scope. Add **YouTrack Administration** only if you explicitly need admin-level MCP actions.
3. Put the token in your `.env`:

   ```bash
   YOUTRACK_AUTH_HEADER="Bearer perm:your-token-here"
   ```

4. If you need a different YouTrack instance, replace the default host with your own URL, for example `https://YOUR-INSTANCE.youtrack.cloud/mcp`

Skipping 6.6? Leave it as is — the other three servers start regardless.

Full YouTrack instructions, including how to create the token: [experiment 6.6](../experiments/6_MCPs-and-Skills/6-YouTrackMCP/).

## Troubleshooting

| Symptom                                                   | Cause                                                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `claude mcp list` shows a raw `${YOUTRACK_AUTH_HEADER:-}` | Display only — the listing prints the stored config, not the expanded value. The real value does reach the server. |
| A server connects but every call is unauthorized          | Started with a bare `claude`, so `.env` was never loaded. Use `npm run claude:mcp`.                                |
| `dotenv: command not found`                               | Dependencies not installed yet — run `npm install`.                                                                |
| `youtrack` fails to connect                               | The host in `.mcp.json` points at the wrong instance, or the token is missing the `Bearer ` prefix.                |
