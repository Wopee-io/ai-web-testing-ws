# GitHub Copilot — Workshop Cheat Sheet

A checklist-style reference for testers & test automation engineers. Ordered by impact for test work.

## 1. Chat Modes

- [ ] **Agent** — Copilot plans, edits multiple files, runs terminal commands, uses MCP/tools. Default for test automation tasks (scaffolding, refactors, MCP-driven actions).
- [ ] **Ask** — Q&A only. Use for explaining code, debugging hints, reading docs — no edits.
- [ ] **Plan** (aka Planning mode) — Produces a step-by-step plan before any edits. Use before large changes (migrating a suite, adding a new framework).
- [ ] Switch modes from the chat input dropdown (or `Ctrl/Cmd+.`).

## 2. Models & Premium Requests

- [ ] Model picker in chat: Claude Sonnet/Opus, GPT-5, Gemini, o-series, etc.
- [ ] **Premium requests** — Non-base models consume premium quota (multiplier per model, e.g. Claude Opus ~3×, Sonnet ~1×, GPT-4.1 = 0×). Note: the quotas are keep changing - see latest multipliers in the [docs](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) or your VS Code settings.
- [ ] Monthly allowance depends on plan (Free / Pro / Pro+ / Business / Enterprise). Check usage at github.com/settings/copilot.
- [ ] Rule of thumb for tests: **Sonnet** for day-to-day, **Opus / GPT-5.5** for hard debugging or large refactors, base model for trivial edits.

## 3. MCP (Model Context Protocol) Setup

- [ ] Config file: `.vscode/mcp.json` (workspace) or user settings.
- [ ] Format:

  ```json
  {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["-y", "@playwright/mcp@latest"]
      }
    }
  }
  ```

- [ ] Useful MCP servers for testers: **Playwright**, **Wopee.io**, **GitHub**, **Filesystem**, **Fetch**. See also [MCP GitHub](https://github.com/mcp) listing.
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

## 5. Extensions (must-have for web app testers)

- [ ] **GitHub Copilot Chat**
- [ ] [**Playwright Test for VSCode**](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [ ] [**Playwright MCP**](https://playwright.dev/mcp/introduction) (via `mcp.json`)
- [ ] [**Playwright CLI**](https://playwright.dev/agent-cli/introduction)
- [ ] ?? **ESLint**, **Prettier**

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

## Try It Yourself (~15 min, in this repo)

Everything from §3-§6 is already set up in this workshop repo — you verify and use, not build:

| Pre-configured | Where |
| --- | --- |
| Playwright MCP (+ Wopee.io, Atlassian, YouTrack) | `.vscode/mcp.json` |
| Project instructions | `AGENTS.md` (source of truth) + `.github/copilot-instructions.md` |
| Reusable prompts | `.github/prompts/` — `/test-cases`, `/generate-e2e-test` |
| Custom agent | `.github/agents/test-analyst.agent.md` |
| Extension recommendations | `.vscode/extensions.json` |

1. **Verify setup (3 min).** Open this repo in VS Code — accept the extension recommendations popup if it appears. In Copilot Chat, check the 🛠️ tools icon shows the **playwright** MCP server (start it from the MCP panel if stopped; the other three servers need `.env` credentials — skip them today). Type `/` in chat and confirm `/test-cases` and `/generate-e2e-test` are listed.
2. **See the instructions land (2 min).** Ask mode: *"Which test conventions apply in this repo and where do they come from?"* — the answer should reflect `AGENTS.md` (locators, no hard waits) and cite the instructions files.
3. **Plan (3 min).** Plan mode: *"Plan E2E tests for the cart flow on <https://foodora.lovable.app/>"* — review the plan, trim it to 2 tests.
4. **Generate & run (5 min).** Run `/generate-e2e-test` with a flow like *"filter by Pizza, open Pizza Corner, add Margherita to cart, verify cart badge"* — watch Agent mode explore the live app via Playwright MCP, write the spec into `tests/`, and run it to green.
5. **Compare (2 min).** Rerun step 4 with a different model from the picker (base vs Sonnet-class) and compare spec quality vs premium-request cost.

> Deeper dive (optional, at home): repeat this setup from scratch in your own Lovable repo — steps §3-§6 of the cheat sheet are the recipe. Don't commit generated demo specs to this repo.

**Bonus — vyzkoušejte češtinu 🇨🇿** — otevřete **nový chat** (Ask mode) a zadejte tento prompt, ať celá session běží v češtině:

> Ahoj Copilote! Projdi prosím celý tento repozitář a srozumitelně mi vysvětli, o co se jedná: jaký je účel projektu, jaké technologie používá, jaká je struktura složek a jak spolu jednotlivé části souvisí. Odpovídej **česky** a pokračuj v češtině i ve všech dalších odpovědích v této konverzaci. Buď **vtipný a hravý** (klidně s vhodným vtípkem nebo emoji) a zároveň **proaktivní** — nečekej, až si o něco řeknu. Na konci **každé** své odpovědi mi navrhni **3 konkrétní další kroky**, které bychom mohli udělat, očísluj je **1, 2, 3**, a já odpovím jen číslem, podle toho, co chci spustit. Pojďme na to! 🚀
