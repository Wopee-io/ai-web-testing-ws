# Cursor - Workshop Cheat Sheet

A checklist-style reference for testers & test automation engineers. Ordered by impact for test work.

> Cursor is a standalone AI-first IDE (VS Code fork) by Anysphere - [cursor.com](https://cursor.com). Docs: [cursor.com/docs](https://cursor.com/docs).

## 1. Chat Modes

- [ ] **Agent** (default) - autonomous multi-file edits, terminal commands, MCP/tools. Default for test automation tasks.
- [ ] **Plan Mode** - researches the codebase, asks clarifying questions, produces an editable plan before coding. Use before large changes (`Shift+Tab` from the chat input).
- [ ] **Ask** - read-only Q&A over the codebase, no edits.
- [ ] **Manual** - edits only the files you explicitly give it.
- [ ] **Cloud** - the same prompt handed to a parallel Cloud Agent running in an isolated VM (see §6).
- [ ] Inline edit stays on `Cmd+K`; Tab completion is its own model surface.

## 2. Models & Pricing

- [ ] Model picker: Claude (Sonnet/Opus/Fable), GPT-5.x, Gemini, Grok, in-house **Composer** (fast agentic model), and more.
- [ ] **Auto router tiers** - Auto Cost (flat rate), Auto Balance, Auto Intelligence (billed at the model's API rate).
- [ ] **Token-based usage** - each plan includes a dollar pool for third-party models plus generous separate limits for Cursor's own models; when the pool runs out you can opt into on-demand usage at API rates. Quotas keep changing - check [cursor.com/pricing](https://cursor.com/pricing) and your dashboard.
- [ ] Plans: Hobby (free) / Pro $20 / Pro+ $60 / Ultra $200 / Teams from $40 per user / Enterprise.
- [ ] Rule of thumb for tests: **Composer or Auto** for day-to-day, **Claude Opus-class or GPT-5.5+** for hard debugging or large refactors.

## 3. MCP (Model Context Protocol) Setup

- [ ] Config file: `.cursor/mcp.json` (workspace) or `~/.cursor/mcp.json` (global).
- [ ] Format:

  ```json
  {
    "mcpServers": {
      "playwright": {
        "command": "npx",
        "args": ["-y", "@playwright/mcp@latest"]
      }
    }
  }
  ```

- [ ] Remote servers: `{ "url": "https://host/mcp", "headers": { ... } }` (SSE / streamable HTTP, OAuth supported).
- [ ] One-click installs from the Cursor Marketplace ("Add to Cursor").
- [ ] Manage from Settings → MCP; enterprise plans can allowlist servers.

## 4. `.cursor/` in Workspace - Our Preferred Approach

Commit these per repo so the whole team gets the same experience:

- [ ] `.cursor/rules/*.mdc` - project rules (YAML frontmatter: `description`, `globs`, `alwaysApply`); e.g. a rule scoped to `tests/**/*.spec.ts` enforcing locator conventions
- [ ] `AGENTS.md` (root, nested allowed) - cross-tool agent instructions; fully supported by Cursor
- [ ] `.cursor/mcp.json` - shared MCP servers
- [ ] `.cursor/skills/<name>/SKILL.md` - skills (replaced slash commands; open [Agent Skills](https://agentskills.io) standard, portable across tools)
- [ ] `.cursor/hooks.json` - lifecycle hooks (format after edit, block risky commands)
- [ ] `.cursor/BUGBOT.md` - guidance for Bugbot PR reviews
- [ ] `.cursorrules` (legacy) - still read, but migrate to `.cursor/rules/`

## 5. Tester Setup (must-have for web app testers)

- [ ] [**Playwright MCP**](https://github.com/microsoft/playwright-mcp) (via `.cursor/mcp.json`, see §3) - locators generated from the real DOM
- [ ] **Built-in Browser tool** - no MCP needed: the agent navigates, clicks, types, screenshots, reads console and network traffic, with approval prompts (manual / allowlist / auto-run)
- [ ] **Playwright Test for VSCode** extension - Cursor runs VS Code extensions
- [ ] **Bugbot** - automated PR review for bugs/quality; trigger with `bugbot run` on a PR

## 6. Customization Checklist

- [ ] **Rules** - Team Rules (dashboard) → Project Rules (`.cursor/rules/`) → User Rules; four application types (always / intelligent / glob / manual).
- [ ] **Skills** - `/name` or auto-applied; optional `scripts/`, `references/`, `assets/`; `/migrate-to-skills` converts legacy commands.
- [ ] **Hooks** - events like `afterFileEdit`, `beforeShellExecution`, `preToolUse`; JSON over stdio; exit code 2 blocks the action. Use for auto-format, secret scanning, guarding `rm`.
- [ ] **Cloud Agents** - parallel isolated VMs; launch from the IDE, [cursor.com/agents](https://cursor.com/agents), Slack, GitHub PR comments (`@cursor`), or API; they push branches and open PRs with artifacts (screenshots, videos, logs).
- [ ] **CLI** - `curl https://cursor.com/install -fsS | bash`; run `agent` interactively or `agent -p "prompt" --output-format text` in CI; `&` prefix hands a task off to a Cloud Agent.
- [ ] **Memories** - being phased out in favor of Rules; keep durable knowledge in `.cursor/rules/`.

## 7. Demo Flow (for this workshop)

1. Commit `.cursor/rules/playwright.mdc` (locator rules, no hard waits) + `AGENTS.md` → show the rule auto-attach when a spec file is in context.
2. **Plan Mode**: "Add E2E coverage for the checkout flow" → review and edit the generated plan live.
3. **Agent + browser**: with Playwright MCP or the built-in Browser tool, let the agent walk the app and generate specs from the real accessibility tree.
4. **Self-heal**: agent runs `npx playwright test`, reads failures, fixes locators, reruns to green; show a hook blocking a dangerous command.
5. **Scale out**: run a committed `/generate-tests` skill, then hand flaky-test triage to a Cloud Agent and show the resulting PR with artifacts.

## Try It Yourself

Continue in your Lovable repo - add Cursor setup step by step:

1. **Open the repo in Cursor** (import your VS Code extensions when prompted).
2. **Create `.cursor/rules/playwright.mdc`** scoped to `tests/**/*.spec.ts` - locator strategy, naming, no hard waits.
3. **Add `AGENTS.md`** (or reuse the one from the Copilot demo - Cursor reads it too).
4. **Create `.cursor/mcp.json`** with Playwright MCP (see §3) and enable it in Settings → MCP.
5. **Try each mode**: Ask ("explain the routing"), Plan ("plan E2E tests for checkout"), Agent (execute the plan).
6. **Let the agent use the browser** - built-in Browser tool or Playwright MCP - and generate a spec from what it sees.
7. **Add a skill** `.cursor/skills/generate-e2e/SKILL.md` that turns a user flow into a Playwright spec.
8. **Add a hook** in `.cursor/hooks.json` that runs Prettier after each file edit.
9. **Generate 3 E2E tests** and run them to green.
10. **Commit `.cursor/` and `AGENTS.md`**, then try handing one task to a Cloud Agent.
