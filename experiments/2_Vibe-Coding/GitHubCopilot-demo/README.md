# GitHub Copilot — Workshop Cheat Sheet

A checklist-style reference for testers & test automation engineers. Ordered by impact for test work.

## 1. Chat Modes

- [ ] **Agent** — Copilot plans, edits multiple files, runs terminal commands, uses MCP/tools. Default for test automation tasks (scaffolding, refactors, MCP-driven actions).
- [ ] **Ask** — Q&A only. Use for explaining code, debugging hints, reading docs — no edits.
- [ ] **Plan** (aka Planning mode) — Produces a step-by-step plan before any edits. Use before large changes (migrating a suite, adding a new framework).
- [ ] Switch modes from the chat input dropdown (or `Ctrl/Cmd+.`).

## 2. Models & Premium Requests

- [ ] Model picker in chat: Claude Sonnet/Opus, GPT-5, Gemini, o-series, etc.
- [ ] **Premium requests** — Non-base models consume premium quota (multiplier per model, e.g. Claude Opus ~10×, Sonnet ~1×, GPT-4.1 = 0×).
- [ ] Monthly allowance depends on plan (Free / Pro / Pro+ / Business / Enterprise). Check usage at github.com/settings/copilot.
- [ ] Rule of thumb for tests: **Sonnet** for day-to-day, **Opus / GPT-5** for hard debugging or large refactors, base model for trivial edits.

## 3. MCP (Model Context Protocol) Setup

- [ ] Config file: `.vscode/mcp.json` (workspace) or user settings.
- [ ] Format:

  ```json
  {
    "servers": {
      "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }
    }
  }
  ```

- [ ] Useful MCP servers for testers: **Playwright**, **Wopee.io**, **GitHub**, **Filesystem**, **Fetch**.
- [ ] Start/stop/inspect from the Chat view → **MCP Servers** panel.
- [ ] Secrets → use VS Code input variables (`${input:...}`), never hardcode.

## 4. `.vscode/` in Workspace — Our Preferred Approach

Commit these per repo so the whole team gets the same experience:

- [ ] `.vscode/mcp.json` — shared MCP servers
- [ ] `.vscode/settings.json` — Copilot settings, enabled tools, model defaults
- [ ] `.vscode/extensions.json` — recommended extensions
- [ ] `.github/copilot-instructions.md` — project-wide custom instructions (always on)
- [ ] `.github/instructions/*.instructions.md` — scoped instructions (e.g. `applyTo: "**/*.spec.ts"`)
- [ ] `.github/prompts/*.prompt.md` — reusable prompt templates
- [ ] `.github/chatmodes/*.chatmode.md` — custom chat modes
- [ ] `AGENTS.md` (root) — cross-tool agent instructions (Copilot, Claude, Codex, Cursor)
- [ ] `CLAUDE.md` (root or `.claude/`) — Claude-specific brief; readable by Copilot too

## 5. Extensions (must-have for testers)

- [ ] **GitHub Copilot** + **GitHub Copilot Chat**
- [ ] **Playwright Test for VSCode**
- [ ] **Playwright MCP** (via `mcp.json`)
- [ ] **ESLint**, **Prettier**
- [ ] **GitLens** (diffs & blame for flaky tests)
- [ ] **Error Lens** (inline errors)
- [ ] **REST Client** or **Thunder Client** (API testing)

## 6. Customization Checklist (cover everything from [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/customization/overview))

- [ ] **Custom instructions** (`copilot-instructions.md` + scoped `*.instructions.md` with `applyTo`) — coding style, test naming, locator rules.
- [ ] **Prompt files** (`*.prompt.md`) — reusable flows: "generate Playwright test for URL", "convert Cypress → Playwright", "write BDD scenarios".
- [ ] **Custom chat modes** (`*.chatmode.md`) — e.g. `QA-reviewer`, `test-generator`, `bug-reproducer` with scoped tools & instructions.
- [ ] **Tool sets** — group built-in + MCP tools; attach to chat modes (e.g. `playwright-tools` = browser + fs + terminal).
- [ ] **MCP servers** — external tool integrations (see §3).
- [ ] **Language model selection** — per-request model override; can bring own API key.
- [ ] **Agent skills / plugins** — bundled multi-step workflows distributable across repos.
- [ ] **Hooks** — lifecycle shell commands (auto-format after edit, run lint, etc.).
- [ ] **Settings** (`settings.json`) — `github.copilot.*`, `chat.*`, tool approvals, telemetry.
- [ ] **AGENTS.md** — shared, always-on project instructions read by Copilot + other agents (Claude, Cursor, Codex…). Place at workspace root. Enable via `"chat.useAgentsMdFile": true` (experimental, off by default).
- [ ] **CLAUDE.md** — Claude Code's brief; Copilot can also read it for cross-tool consistency. Enable via `"chat.useClaudeMdFile": true`. Locations: workspace root, `.claude/`, or user home.
- [ ] **Precedence of always-on files** — `.github/copilot-instructions.md` + `AGENTS.md` + `CLAUDE.md` all load automatically (when enabled). Keep one as the source of truth and symlink the others to avoid drift.
- [ ] **Parent-repo discovery** — monorepo/nested workspaces inherit instructions from ancestors.
- [ ] **Chat customizations editor** — UI to manage all of the above (`Chat: Configure Chat...`).

## 7. Demo Flow (for this workshop)

1. Open workspace → show `.vscode/mcp.json` + `.github/copilot-instructions.md`.
2. Switch chat mode: **Ask** → **Plan** → **Agent**.
3. Swap models: base → Sonnet → Opus; point out premium counter.
4. Run a `.prompt.md` to scaffold a Playwright test.
5. Invoke Playwright MCP from Agent mode → show browser automation live.

## Try It Yourself

Clone your Lovable repo and continue working there — add Copilot setup step by step:

1. **Clone your Lovable repo** locally and open it in VS Code.
2. **Install required extensions** (see §5): GitHub Copilot, Copilot Chat, Playwright Test.
3. **Create `.vscode/mcp.json`** with Playwright MCP (see §3 snippet). Start the server from the MCP panel.
4. **Add `.github/copilot-instructions.md`** — project conventions (stack, locator strategy, test naming).
5. **Add `AGENTS.md`** at repo root with the same core rules so other AI tools stay aligned.
6. **Create a `.github/prompts/generate-e2e-test.prompt.md`** that takes a user flow and produces a Playwright spec.
7. **Try each chat mode** on the repo:
   - **Ask** — "Explain how routing works here."
   - **Plan** — "Plan adding Playwright E2E tests for checkout."
   - **Agent** — execute the plan; let it create files and run tests.
8. **Switch models** mid-task (base → Sonnet → Opus) and compare quality vs. premium cost.
9. **Generate 3 E2E tests** for your app using the prompt file + Playwright MCP.
10. **Commit `.vscode/`, `.github/`, `AGENTS.md`** so the setup travels with the repo.
11. **Vyzkoušejte češtinu 🇨🇿** — otevřete **nový chat** (Ask mode) a zadejte tento prompt, ať celá session běží v češtině:

    > Ahoj Copilote! Projdi prosím celý tento repozitář a srozumitelně mi vysvětli, o co se jedná: jaký je účel projektu, jaké technologie používá, jaká je struktura složek a jak spolu jednotlivé části souvisí. Odpovídej **česky** a pokračuj v češtině i ve všech dalších odpovědích v této konverzaci. Buď **vtipný a hravý** (klidně s vhodným vtípkem nebo emoji) a zároveň **proaktivní** — nečekej, až si o něco řeknu. Na konci **každé** své odpovědi mi navrhni **3 konkrétní další kroky**, které bychom mohli udělat, očísluj je **1, 2, 3**, a já odpovím jen číslem, podle toho, co chci spustit. Pojďme na to! 🚀
