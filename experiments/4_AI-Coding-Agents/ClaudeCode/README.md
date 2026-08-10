# Claude Code - Workshop Cheat Sheet

A checklist-style reference for testers & test automation engineers. Ordered by impact for test work.

> Claude Code is Anthropic's agentic coding tool - terminal CLI first, plus VS Code/JetBrains extensions, desktop app, and web ([claude.ai/code](https://claude.ai/code)). Docs: [code.claude.com/docs](https://code.claude.com/docs).

## 1. Surfaces & Permission Modes

- [ ] **CLI** - `claude` in the project dir; the full-featured surface. Install: `curl -fsSL https://claude.ai/install.sh | bash` or `brew install --cask claude-code`.
- [ ] **VS Code extension** (works in Cursor too) - inline diffs, @-mentions, plan review.
- [ ] **Web + mobile** - [claude.ai/code](https://claude.ai/code) for long-running cloud tasks; pull a cloud session into your terminal with `claude --teleport`.
- [ ] **Permission modes** (cycle with `Shift+Tab`): **Manual** (prompt per tool) → **Accept Edits** → **Plan** (read-only exploration, plan approval before edits) → **Auto** (auto-approve with safety checks). Use Plan mode the way you use Copilot's Plan or Cursor's Plan Mode.
- [ ] Fine-grained permission rules in settings: `Bash(npx playwright test*)` in `permissions.allow` lets the agent run tests without prompts.

## 2. Models & Pricing

- [ ] Model picker: `/model` - `haiku`, `sonnet`, `opus`, `fable` tiers.
- [ ] **Subscriptions**: Pro $20/month includes Claude Code; Max 5x $100 and Max 20x $200 for heavier agent use; Team from $25/seat. Usage draws from a 5-hour rolling window plus a weekly cap shared with claude.ai chat.
- [ ] **API pay-as-you-go** (per 1M tokens): Haiku 4.5 $1/$5, Sonnet 5 $3/$15, Opus 5 $5/$25, Fable 5 $10/$50. Prompt caching cuts input cost roughly 10x on repeat context.
- [ ] Rule of thumb for tests: **Sonnet** for day-to-day generation and fixing, **Opus/Fable** for gnarly debugging, **Haiku** for cheap review subagents.

## 3. MCP (Model Context Protocol) Setup

- [ ] Quick add: `claude mcp add playwright -- npx -y @playwright/mcp@latest`
- [ ] Team-shared config: `.mcp.json` at the project root (`--scope project`), committed to git:

  ```json
  {
    "mcpServers": {
      "playwright": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@playwright/mcp@latest"]
      }
    }
  }
  ```

- [ ] Remote servers: `"type": "http"` with `url` (OAuth handled via `/mcp` in-session).
- [ ] Secrets via env expansion: `${VAR}` or `${VAR:-default}` - never hardcode.
- [ ] Manage in-session with `/mcp`; `claude mcp list / get / remove` from the shell.

## 4. `CLAUDE.md` & `.claude/` in Workspace - Our Preferred Approach

Commit these per repo so the whole team gets the same experience:

- [ ] `CLAUDE.md` (root) - project brief: stack, locator strategy, test naming, how to run tests. Generate with `/init` (it also reads `.cursorrules` and `copilot-instructions.md`). Keep under ~200 lines.
- [ ] `AGENTS.md` - not read natively; wire it in with a one-line `@AGENTS.md` import inside CLAUDE.md (or symlink) so all tools share one source of truth.
- [ ] `.mcp.json` (root) - shared MCP servers
- [ ] `.claude/settings.json` - shared permissions, hooks, model defaults (`.claude/settings.local.json` stays gitignored)
- [ ] `.claude/rules/*.md` - modular rules, optionally path-scoped via `paths:` frontmatter (e.g. rules that load only for `tests/**`)
- [ ] `.claude/skills/<name>/SKILL.md` - custom slash commands / skills
- [ ] `.claude/agents/*.md` - subagent definitions
- [ ] `CLAUDE.local.md` (gitignored) - personal notes appended on top

## 5. Tester Setup (must-have for web app testers)

- [ ] [**Playwright MCP**](https://github.com/microsoft/playwright-mcp) (see §3) - browser control from the accessibility tree
- [ ] [**Playwright CLI**](https://playwright.dev/docs/getting-started-cli) - token-efficient alternative: `npm i -g @playwright/cli@latest`, then `playwright-cli install --skills` adds a ready-made Claude Code skill (~4x fewer tokens than MCP)
- [ ] **Test-loop hook** - `PostToolUse` hook matching `Edit|Write` that runs lint/tests after every edit; a failing exit blocks and feeds the error back = self-healing tests
- [ ] **Bundled review skills** - `/code-review`, `/security-review`

## 6. Customization Checklist

- [ ] **CLAUDE.md + rules + memory** - see §4; Claude also keeps its own project memory between sessions (`/memory` to inspect).
- [ ] **Skills / slash commands** - SKILL.md with frontmatter (`description`, `allowed-tools`, `disable-model-invocation`, `$ARGUMENTS`); follows the open [Agent Skills](https://agentskills.io) standard, portable to Cursor and others.
- [ ] **Subagents** - `.claude/agents/*.md` with own tools, model, and permissions; e.g. a read-only `test-reviewer` on Haiku; run in parallel and in background.
- [ ] **Hooks** - lifecycle events (`PreToolUse`, `PostToolUse`, `Stop`...) running shell commands; exit code 2 blocks the action. Gate "done" on the suite passing.
- [ ] **Output styles** - switch personality via `/config` (Default, Explanatory, Learning, custom).
- [ ] **Headless / CI** - `claude -p "prompt" --output-format json` for scripts; **Claude Agent SDK** (TypeScript/Python) to build your own testing agents on the same harness.
- [ ] **GitHub Actions** - `/install-github-app`, then `@claude` mentions on issues/PRs; can run on your Pro/Max subscription via `claude setup-token`.
- [ ] **Plugins** - bundle skills + agents + hooks + MCP servers; `/plugin install <name>` (e.g. the official Playwright plugin).

## 7. Demo Flow (for this workshop)

1. `claude` in the repo → `Shift+Tab` to **Plan mode** → "Analyze our Playwright suite: structure, fixtures, coverage gaps." Show `/context`.
2. `/init` → generated `CLAUDE.md`; add tester rules (getByRole locators, how to run tests). Commit it.
3. `claude mcp add playwright -- npx -y @playwright/mcp@latest` → "Open the app, walk the checkout flow, note every element tests should assert on."
4. "Write a spec for the discount-code path, run it, fix until green" → show the `PostToolUse` test hook enforcing the loop.
5. Add a `test-reviewer` subagent (read-only, Haiku) → finish with headless mode: `claude -p "/code-review" --output-format json`.

## Try It Yourself

Continue in your Lovable repo - add Claude Code setup step by step:

1. **Install the CLI** and run `claude` in your repo (or install the VS Code extension).
2. **Run `/init`** - it reads your existing `copilot-instructions.md`; review the generated `CLAUDE.md`.
3. **Import `AGENTS.md`** by adding `@AGENTS.md` to `CLAUDE.md` so all your tools share one rule set.
4. **Add Playwright MCP** with project scope so `.mcp.json` lands in git (see §3).
5. **Try Plan mode** (`Shift+Tab`): "Plan adding Playwright E2E tests for checkout" - approve, watch it execute.
6. **Add a permission rule** allowing `npx playwright test*` and watch it iterate on failures unattended.
7. **Create a skill** `.claude/skills/generate-e2e/SKILL.md` that turns a user flow into a Playwright spec.
8. **Add a hook** that runs `npx playwright test --reporter=line` after each spec edit.
9. **Generate 3 E2E tests** for your app and run them to green.
10. **Commit `CLAUDE.md`, `.claude/`, `.mcp.json`** so the setup travels with the repo; try `claude -p` headless as a bonus.
