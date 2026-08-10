# OpenCode - Workshop Cheat Sheet

A checklist-style reference for testers & test automation engineers. Ordered by impact for test work.

> OpenCode is the open-source (MIT) terminal coding agent from Anomaly (formerly SST) - [opencode.ai](https://opencode.ai). Repo: [anomalyco/opencode](https://github.com/anomalyco/opencode). Not to be confused with Charm's Crush, which briefly shared the name.

## 1. Modes & Agents

- [ ] **Build** (default agent) - all tools enabled: edits files, runs terminal commands, uses MCP. Switch agents with **Tab**.
- [ ] **Plan** - restricted agent: file edits and bash set to "ask". Use before large changes, same idea as Copilot's Plan mode.
- [ ] **Subagents** - `@general` (multi-step research), `@explore` (read-only code search), `@scout` (external docs research). Mention them: `@explore find all fixtures`.
- [ ] **Non-interactive** - `opencode run "prompt" --format json` for CI scripting; `opencode serve` for a headless HTTP server.
- [ ] Handy TUI commands: `/init`, `/models`, `/connect`, `/undo` (reverts file changes!), `/redo`, `/share`, `/compact`. Inline: `@file` references, `` !command `` runs bash, drag & drop images.

## 2. Models & Pricing

- [ ] The tool is free (MIT) - you pay only for model usage.
- [ ] **Bring your own key**: 75+ providers (Anthropic, OpenAI, Google, OpenRouter, Groq, DeepSeek, local Ollama/LM Studio...). Connect via `/connect` or `opencode auth login`.
- [ ] **Use existing subscriptions**: Claude Pro/Max, ChatGPT Plus/Pro, or GitHub Copilot login - no extra cost.
- [ ] **OpenCode Zen** - their pay-as-you-go gateway with ~50 coding-benchmarked models, some free beta models included.
- [ ] **OpenCode Go** - budget subscription (~$10/month for ~$60 of usage across open models like DeepSeek, Qwen, Kimi).
- [ ] Model format: `provider/model`, e.g. `anthropic/claude-sonnet-5`. Pricing moves fast - check [opencode.ai/docs/zen](https://opencode.ai/docs/zen/) before relying on numbers.

## 3. MCP (Model Context Protocol) Setup

- [ ] Config lives in `opencode.json` at the project root (schema: `https://opencode.ai/config.json`).
- [ ] Format (this Playwright block is the officially documented one):

  ```json
  {
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
      "playwright": {
        "type": "local",
        "command": ["npx", "@playwright/mcp@latest"],
        "enabled": true
      }
    }
  }
  ```

- [ ] Remote servers: `"type": "remote"` with `url`, `headers`, optional OAuth.
- [ ] Secrets via substitution: `{env:VAR}` or `{file:path}` - never hardcode.
- [ ] CLI management: `opencode mcp add / list / auth`.

## 4. Project Files in the Repo - Our Preferred Approach

Commit these per repo so the whole team gets the same experience:

- [ ] `opencode.json` (root) - models, MCP servers, permissions, custom agents/commands
- [ ] `AGENTS.md` (root) - the rules file; industry-standard, shared with Copilot, Claude & Cursor. Generate with `/init`.
- [ ] `.opencode/agents/*.md` - custom agents (YAML frontmatter: `description`, `mode`, `model`, `permission`)
- [ ] `.opencode/commands/*.md` - custom slash commands (filename becomes `/name`; supports `$ARGUMENTS`, `` !`shell` `` output injection, `@file` refs)
- [ ] `.opencode/plugins/*.ts` - JS/TS lifecycle hooks (after-edit formatting, permission events...)
- [ ] Compatibility: OpenCode also reads `CLAUDE.md`, `.cursor/rules` (via the `instructions` array) and `~/.claude/skills/` - your existing setup carries over.

## 5. Tester Setup (must-have for web app testers)

- [ ] [**Playwright MCP**](https://github.com/microsoft/playwright-mcp) (via `opencode.json`, see §3)
- [ ] **Permission-gated test runs** - allow tests without approving every command:

  ```json
  { "permission": { "bash": { "*": "ask", "npx playwright test*": "allow" } } }
  ```

- [ ] **Built-in LSP** - the agent sees TypeScript diagnostics after each edit
- [ ] **GitHub integration** - comment `/oc` on an issue/PR to dispatch the agent in your own Actions runners (`opencode github install`)

## 6. Customization Checklist

- [ ] **AGENTS.md rules** - locator strategy, test naming, fixture conventions; global version at `~/.config/opencode/AGENTS.md`.
- [ ] **Custom agents** - e.g. `qa-reviewer` (read-only, strict model) vs `test-generator` (Build-like, fast model); scaffold with `opencode agent create`.
- [ ] **Custom commands** - reusable flows: `/e2e <url>` to scaffold a spec, `/flaky` to analyze last failed runs.
- [ ] **Plugins** - lifecycle hooks (`tool.execute.before/after`, `file.edited`...) as local files or npm packages.
- [ ] **Permissions** - allow/ask/deny per tool, glob rules per bash command.
- [ ] **Session sharing** - `/share` publishes a link to the whole session; great for handing a debugging transcript to a colleague.
- [ ] **SDK & server** - `@opencode-ai/sdk` (TypeScript) drives OpenCode programmatically; build your own test-triage bots.
- [ ] **Keybinds & themes** - `tui.json` (leader key `ctrl+x`, `/themes`).

## 7. Demo Flow (for this workshop)

1. `opencode` in the repo → `/connect` (pick a provider or a free Zen model) → `/models`.
2. `/init` → show the generated `AGENTS.md`, add one tester rule (no hard waits, `getByRole` locators).
3. **Tab** to Plan agent → "How would you add E2E tests for checkout?" → **Tab** back to Build → let it write and run the spec via `` !npx playwright test ``. Show `/undo`.
4. Add the Playwright MCP block to `opencode.json` → "Open the app, explore the login page, generate a Playwright test from what you see."
5. Create `.opencode/commands/flaky.md` → run `/flaky` → finish with `/share`.

## Try It Yourself

Continue in your Lovable repo - add OpenCode setup step by step:

1. **Install**: `curl -fsSL https://opencode.ai/install | bash` (or `npm i -g opencode-ai`).
2. **Connect a model**: `/connect` - use a free Zen beta model, your Claude/ChatGPT/Copilot subscription, or an API key.
3. **Generate rules**: `/init` creates `AGENTS.md`; align it with your existing `copilot-instructions.md`.
4. **Add Playwright MCP** to `opencode.json` (see §3) and commit it.
5. **Try the agents**: Plan for analysis, Build for edits, `@explore` for code search.
6. **Create a custom command** `.opencode/commands/generate-e2e.md` that takes a user flow and produces a Playwright spec.
7. **Set permissions** so `npx playwright test*` is always allowed - watch the agent iterate on failures unattended.
8. **Generate 3 E2E tests** for your app and run them.
9. **Commit `opencode.json`, `AGENTS.md`, `.opencode/`** so the setup travels with the repo.
10. **Share your session** with `/share` and compare results with your neighbors.
