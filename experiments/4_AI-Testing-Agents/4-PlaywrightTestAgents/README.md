# Experiment 4.4: Playwright Test Agents with GitHub Copilot

Let Playwright's built-in AI agents plan, generate, and heal tests for you - driven from VS Code GitHub Copilot via MCP.

**SUT (system under test):** [https://foodora.lovable.app/](https://foodora.lovable.app/) - a demo food-delivery app (restaurant cards with ratings and delivery fees, category filters, search, cart, `/auth` sign-in).

## The Concept

Since v1.56, Playwright ships three **Test Agents** ([docs](https://playwright.dev/docs/test-agents)) that appear as custom agents in the Copilot Chat dropdown:

| Agent | What it does | Input | Output |
| --- | --- | --- | --- |
| 🎭 **planner** | Explores the live app in a real browser | Your request + a seed test | Markdown test plan in `specs/` |
| 🎭 **generator** | Turns the plan into specs, verifying every step live in the browser | A plan from `specs/` | Test files in `tests/` |
| 🎭 **healer** | Runs the suite, replays failures, patches locators/waits, reruns until green | A failing test | A passing test (or `test.fixme()` if the app itself is broken) |

Under the hood they talk to a bundled MCP server (`npx playwright run-test-mcp-server`) that exposes `browser_*` interaction tools plus agent-specific tools (`planner_save_plan`, `generator_write_test`, `test_debug`...). Snapshots are accessibility-tree based - cheap in tokens, no screenshots needed.

## Prerequisites

- [ ] **VS Code 1.105+** (October 2025 or newer) with **GitHub Copilot** (Chat enabled)
- [ ] **Node.js 20+**
- [ ] **Playwright 1.56+** (latest recommended; the agents ship with Playwright itself, no extra install)
- [ ] Network access to [foodora.lovable.app](https://foodora.lovable.app/)

---

## Exercise (60 min)

### Part 1 - Setup (10 min)

1. Create a fresh project (keeps this repo's config untouched):

   ```bash
   mkdir foodora-agents && cd foodora-agents
   npm init playwright@latest -- --quiet
   ```

2. Generate the agent definitions for VS Code Copilot:

   ```bash
   npx playwright init-agents --loop=vscode --prompts
   ```

   What appeared:
   - `.github/agents/playwright-test-{planner,generator,healer}.agent.md` - the three Copilot custom agents
   - `.vscode/mcp.json` - the `playwright-test` MCP server entry
   - `specs/` - where plans will land
   - `tests/seed.spec.ts` - the bootstrap test
   - `.github/prompts/playwright-test-*.prompt.md` - reusable prompt templates (thanks to `--prompts`)

3. Point the seed test at the SUT - the planner runs it to get a ready-to-use page:

   ```ts
   // tests/seed.spec.ts
   import { test, expect } from '@playwright/test';

   test('seed', async ({ page }) => {
     await page.goto('https://foodora.lovable.app/');
   });
   ```

4. Open the folder in VS Code, open Copilot Chat, and find the three 🎭 agents in the **agents dropdown** (where Ask/Edit/Agent live). If they are missing: check VS Code version, then reload the window.

### Part 2 - Plan (15 min)

1. Select **playwright-test-planner** in the dropdown and prompt:

   > Create a test plan for browsing restaurants: category filters, search, and opening a restaurant. Seed file: `tests/seed.spec.ts`. Save it to `specs/browse.plan.md`.

2. Watch it work: it runs the seed test, then explores the app with `browser_snapshot` / `browser_click` - you will see the browser move.
3. **Read the plan.** This is the key artifact: numbered scenarios (1.1, 1.2...) with steps and expected results, human-readable and editable.
4. Improve it by hand: add one scenario the planner missed (ideas from the real app: the "Pizza" filter should show *Pizza Corner*; search for "sushi" should find *Sushi Masters*, rated 4.9; delivery fee shows *Free* for Pizza Corner). Delete any scenario you find weak - you are the test analyst, the plan is yours.

### Part 3 - Generate (15 min)

1. Select **playwright-test-generator** and prompt:

   > Generate a test for scenario 1.1 from the plan. Test plan: `specs/browse.plan.md`

2. Watch: it replays the scenario step by step in the live browser, verifies selectors and assertions as it goes (`browser_verify_*` tools), then writes the spec with `// spec:` and `// seed:` header comments and one comment per plan step.
3. Repeat for scenario 1.2. **One scenario per invocation, sequentially** - that is the designed workflow.
4. Run what you got:

   ```bash
   npx playwright test --reporter=line
   ```

   Generated tests "may include initial errors" by design - failures here are expected and are the healer's job.

### Part 4 - Heal (10 min)

1. If everything passes, sabotage one test: change a locator to `getByRole('button', { name: 'Does Not Exist' })`.
2. Select **playwright-test-healer** and prompt:

   > Run all my tests and fix the failing ones.

3. Watch the loop: `test_run` finds the failure, `test_debug` pauses at the error, it snapshots the page, generates a better locator, edits the file, reruns until green.
4. Note what it changed - healers prefer robust locators (roles, regex for dynamic text) over brittle CSS.

### Part 5 - Discussion (10 min)

- The plan in `specs/` is reviewable by non-programmers. Who should own it: QA, PO, dev?
- Compare with Experiment 4.1: there we hand-coded the agent loop; here plan → generate → heal comes out of the box. What did we lose? What did we gain?
- The healer marks tests `test.fixme()` when it believes the *app* is broken. Do you trust an agent to make that call?
- Each agent run costs Copilot premium requests. Where does this pay off vs hand-written tests?

---

## Bonus Homework

1. **Full coverage loop** - use the `.github/prompts/playwright-test-coverage.prompt.md` template from the default Copilot agent: it chains planner → generator (scenario by scenario) → healer automatically. Compare the result with your manual run.
2. **Auth flow** - have the planner explore `https://foodora.lovable.app/auth` and plan negative sign-in scenarios (wrong password, empty fields); generate and run them.
3. **Plan-first TDD** - write your own `specs/cart.plan.md` by hand (cart badge count, promo banners like "20% OFF orders over $25") and let the generator implement it without the planner. Which plan produced better tests, yours or the agent's?
4. **Break the app, not the test** - block network requests or test on a slow connection; watch when the healer correctly refuses to "fix" a real bug and uses `test.fixme()`.
5. **Compare loops** - rerun `init-agents` with `--loop=claude` or `--loop=opencode` (see the [3_AI-Coding-Agents](../../3_AI-Coding-Agents/) cheat sheets) and drive the same plan from another tool.
6. **Token-efficient alternative** - try the [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction) (`npm i -g @playwright/cli`), the headless skills-based path recommended for coding agents; compare token use vs MCP.

## Gotchas

- Agent definitions pin a model (currently `Claude Sonnet 4.6`) - if your Copilot plan lacks it, pick another model in the agent file.
- **Regenerate after upgrades**: rerun `init-agents` whenever Playwright updates; the tool lists inside the `.agent.md` files change between versions.
- The app must be reachable - planner, generator, and healer all drive a live browser.
- `init-agents` reuses any test file with "seed" in its name; watch out in repos that already have one.
- Older setups used `.github/chatmodes/*.chatmode.md`; that format is legacy now (`--loop=vscode-legacy`). Current VS Code wants `.github/agents/*.agent.md`.

## Sources

- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright MCP](https://playwright.dev/mcp/introduction) and [Agent CLI](https://playwright.dev/agent-cli/introduction)
- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Release notes](https://playwright.dev/docs/release-notes) (v1.56 introduced Test Agents)
