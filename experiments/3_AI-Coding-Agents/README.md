# AI Coding Agents

Four AI coding agents, one testing workflow. Each demo folder is a checklist-style cheat sheet covering the same ground: chat/agent modes, models & pricing, MCP setup, repo config files, tester must-haves, customization, and a live demo flow - so you can compare tools side by side and pick what fits your team.

> More experiments coming soon.

## Demos

| Demo                               | Tool           | Maker     | Type                                  |
| ---------------------------------- | -------------- | --------- | ------------------------------------- |
| [GitHub Copilot](./GitHubCopilot/) | GitHub Copilot | GitHub    | VS Code extension (+ JetBrains, CLI)  |
| [Cursor](./Cursor/)                | Cursor         | Anysphere | Standalone IDE (VS Code fork) + cloud |
| [Claude Code](./ClaudeCode/)       | Claude Code    | Anthropic | Terminal CLI + IDE extensions + web   |
| [OpenCode](./OpenCode/)            | OpenCode       | Anomaly   | Open-source terminal TUI + CLI        |

## Comparison (August 2026)

Pricing and model lineups change monthly - treat this as orientation, verify before buying.

| Dimension | GitHub Copilot | Cursor | Claude Code | OpenCode |
| --- | --- | --- | --- | --- |
| **Type** | IDE extension (VS Code first) | Standalone IDE (VS Code fork) | Terminal CLI + IDE ext. + web | Open-source terminal TUI |
| **License** | Proprietary | Proprietary | Proprietary | MIT, open source |
| **Pricing** | Free / Pro / Pro+ / Business / Enterprise; premium-request quota | Hobby free / Pro $20 / Pro+ $60 / Ultra $200 / Teams $40+; token-based pool | Pro $20 / Max $100-$200 / Team $25+; or API pay-as-you-go | Tool free; BYO key, subscription login, or Zen gateway / Go sub ~$10 |
| **Models** | Multi-vendor picker (Claude, GPT, Gemini, o-series) | Multi-vendor + in-house Composer + Auto router | Claude family only (Haiku → Sonnet → Opus → Fable) | Any of 75+ providers incl. local (Ollama), plus Copilot/Claude/ChatGPT subscriptions |
| **Plan mode** | Plan chat mode | Plan Mode | Plan permission mode | Plan agent (Tab) |
| **MCP config** | `.vscode/mcp.json` | `.cursor/mcp.json` | `.mcp.json` + `claude mcp add` | `opencode.json` `mcp` block |
| **Repo instruction files** | `.github/copilot-instructions.md`, `*.instructions.md`, AGENTS.md, reads CLAUDE.md | `.cursor/rules/*.mdc`, AGENTS.md (nested) | `CLAUDE.md`, `.claude/rules/`; AGENTS.md via `@import` | `AGENTS.md` native; reads CLAUDE.md and `.cursor/rules` |
| **Reusable prompts** | `.github/prompts/*.prompt.md` | `.cursor/skills/` (Agent Skills std.) | `.claude/skills/` (Agent Skills std.) | `.opencode/commands/*.md` |
| **Subagents / cloud agents** | Copilot coding agent (GitHub-hosted) | Cloud Agents (VMs, Slack/PR triggers) | Subagents + cloud sessions + Actions | Subagents + GitHub `/oc` trigger |
| **Browser control for testing** | Playwright MCP | Native Browser tool + Playwright MCP | Playwright MCP + playwright-cli skill + Chrome ext. | Playwright MCP |
| **Hooks** | Yes (lifecycle) | `.cursor/hooks.json` | `.claude/settings.json` hooks | Plugins (JS/TS events) |
| **Headless / CI** | Copilot CLI / coding agent | `agent -p` CLI | `claude -p`, Agent SDK, GH Action | `opencode run`, server + SDK |
| **Sweet spot for testers** | Team already on GitHub; zero-friction start in VS Code | Exploratory test generation against a live app in one IDE | Self-healing test loops, hook-enforced gates, CI bots | Model flexibility on a budget; scriptable CI triage |

## Shared Conventions Across Tools

All four demos push the same practices, so your repo setup transfers:

- **`AGENTS.md` at the repo root** - every tool reads it (Claude Code via a one-line import). One source of truth for agent rules.
- **Playwright MCP** - the same server config works everywhere; only the config file name differs.
- **Commit the config** (`.vscode/`, `.cursor/`, `.claude/` + `CLAUDE.md`, `opencode.json` + `.opencode/`) so the whole team gets the same experience.
- **Skills** - Cursor and Claude Code share the open [Agent Skills](https://agentskills.io) standard; OpenCode reads `~/.claude/skills/` too.

## Suggested Flow (for this workshop)

1. Start with the [GitHub Copilot demo](./GitHubCopilot/) - most attendees have it already.
2. Pick one challenger - [Cursor](./Cursor/), [Claude Code](./ClaudeCode/), or [OpenCode](./OpenCode/) - and repeat the same "Try It Yourself" steps in your Lovable repo.
3. Compare: quality of generated tests, number of approval clicks, cost visibility, and how much setup travels with the repo.
