# Experiment 4.5: Playwright CLI with GitHub Copilot

In [Experiment 4.4](../4-PlaywrightTestAgents/) the test agents drove the browser through MCP - every snapshot flowed through the model's context. This follow-up teaches the **token-efficient alternative**: the [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction) (`playwright-cli`), where Copilot drives the browser through shell commands and snapshots stay on disk.

**SUT (system under test):** [https://foodora.lovable.app/](https://foodora.lovable.app/) - the same demo food-delivery app.

## The Concept

Same plan → generate → heal loop, different plumbing:

| | 4.4: MCP Test Agents | 4.5: Playwright CLI + skill |
| --- | --- | --- |
| Browser control | `browser_*` MCP tools | `playwright-cli` shell commands |
| Snapshots | Streamed into model context | Written to `.playwright-cli/*.yml`, read selectively |
| Tool schemas | Loaded up front (~26 tools) | None - a skill loads on demand |
| Token cost | Higher (community benchmarks: ~4x) | Lower |
| Browser default | Headed | Headless (`--headed` to watch) |
| Code emission | Generator writes specs via MCP tool | **Every CLI action prints the equivalent Playwright TypeScript** |
| Install | `.github/agents/` + `.vscode/mcp.json` | A skill folder - no MCP config at all |

The magic mechanic: `playwright-cli fill e5 "sushi"` executes the action **and** prints `await page.getByRole('searchbox').fill('sushi')` - the generated code is the raw material for every test. Copilot reads the skill's playbook (`references/test-generation.md`) and runs the whole loop through Bash.

## Prerequisites

- [ ] **VS Code 1.108+** with **GitHub Copilot** (Agent Skills support, native since Dec 2025)
- [ ] **Node.js 20+**, **Playwright 1.62+** (bundles the CLI: `npx playwright cli`, no extra install)
- [ ] Network access to [foodora.lovable.app](https://foodora.lovable.app/)
- [ ] Completed 4.4 recommended - the contrast is the point

---

## Exercise (60 min)

### Part 1 - Setup & skills (10 min)

1. Fresh project (if reusing the 4.4 folder: **disable the `playwright-test` MCP server** in `.vscode/mcp.json` first, or Copilot will grab the MCP tools instead of the skill and you pay the schema tokens anyway):

   ```bash
   mkdir foodora-cli && cd foodora-cli
   npm init playwright@latest -- --quiet
   npx playwright cli --help        # bundled since 1.62 - no install needed
   ```

2. Install the skills where VS Code Copilot finds them:

   ```bash
   npx playwright init-skills --loop=agents
   ```

   This writes three skills into `.agents/skills/`: **playwright-cli** (browser automation + the test-generation playbook), **playwright-trace** (CLI trace analysis), and playwright-component-testing (not needed today). VS Code Copilot discovers `.agents/skills/`, `.claude/skills/`, and `.github/skills/` natively - no `mcp.json`, no AGENTS.md wiring.

3. Open `.agents/skills/playwright-cli/SKILL.md` and skim `references/test-generation.md` - this playbook is what Copilot will follow.
4. Naming note: the skill says `playwright-cli ...`; with the bundled CLI you invoke it as `npx playwright cli ...` (there is no standalone binary unless you `npm i -g @playwright/cli`). Copilot substitutes this automatically per the skill's install fallback; when typing commands yourself, remember the substitution.
5. Seed test, same convention as 4.4:

   ```ts
   // tests/seed.spec.ts
   import { test, expect } from '@playwright/test';

   test('seed', async ({ page }) => {
     await page.goto('https://foodora.lovable.app/');
   });
   ```

### Part 2 - Get a feel for the CLI, by hand (10 min)

Before Copilot touches it, run it yourself in a terminal:

```bash
npx playwright cli open https://foodora.lovable.app/ --headed
npx playwright cli snapshot                  # prints the accessibility tree with refs (e5, e12...)
npx playwright cli find "Search"             # grep the snapshot for elements
npx playwright cli fill e5 "sushi" --submit  # use a real ref from your snapshot
npx playwright cli click e12                 # open a restaurant card
npx playwright cli screenshot
npx playwright cli close
```

Two things to notice:

- Each action prints a **`### Ran Playwright code`** block with real TypeScript - locators taken from the live accessibility tree.
- Each action links its snapshot as a file (`- [Snapshot](.playwright-cli/page-*.yml)`) instead of dumping the tree; the agent reads it selectively with `find` or scoped `snapshot`. In 4.4, that same tree went through the model's context on every single step. That is the entire 4x story.

### Part 3 - Plan with Copilot (12 min)

In Copilot Chat (Agent mode), prompt:

> Use the playwright-cli skill. Explore the app through `tests/seed.spec.ts` using `--debug=cli` and attach, then write `specs/browse.plan.md` covering search, category filters, and opening a restaurant. Follow the test-generation reference.

Watch the playbook execute: it starts the seed with `PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/seed.spec.ts --debug=cli --project=chromium` in the background, attaches with `npx playwright cli attach tw-XXXX`, and explores from the paused session. Two mechanics worth knowing: `resume` runs the seed to completion and **closes the session** (explore from the paused state instead), and without `--project=chromium` the default config pauses once per browser project - three pauses, three session names, for one seed.

Review `specs/browse.plan.md` - same format as 4.4 (numbered scenarios, `**Seed:**` line, steps with `- expect:` bullets). Edit it: add that the "Pizza" filter should show *Pizza Corner* with free delivery, and search "sushi" should find *Sushi Masters* (4.9).

### Part 4 - Generate (15 min)

1. Prompt:

   > Generate tests for scenarios 1.1 and 1.2 from `specs/browse.plan.md`, one at a time, adding assertions for every `- expect:` bullet.

2. Watch the difference from 4.4: Copilot walks each step through the CLI, collects the **emitted TypeScript**, and assembles the spec file - with `// spec:` / `// seed:` headers and `// N.` step comments, same conventions as the MCP generator.
3. Key check the playbook enforces but you should verify: **assertions are not auto-generated** - the CLI captures actions; expectations come from the plan's `- expect:` bullets (via `generate-locator`, `eval`, and aria snapshots). No assertions = not a test.
4. Run them:

   ```bash
   PLAYWRIGHT_HTML_OPEN=never npx playwright test --reporter=line
   ```

### Part 5 - Heal + receipts (13 min)

1. Sabotage a locator or expected text in one generated test, then:

   > Run the tests and heal the failing one. Use `--debug=cli` and attach to diagnose before editing.

   The playbook: run the failing test with `npx playwright test <file> --debug=cli`, attach, step to just before the failure, diagnose with `snapshot` / `console` / `requests`, rehearse the fix in the CLI, paste the emitted code back. Rules it follows: no sleeps, no `networkidle`, `test.fixme()` if the app itself is broken.

2. Bonus flourish for the demo: while healing runs, open the observer dashboard in a second terminal:

   ```bash
   npx playwright cli show
   ```

   Live screencast of every bound browser session - with manual takeover if you want to intervene.

### Wrap-up discussion (built into parts)

- Same loop as 4.4, ~4x cheaper (community-measured; official docs say "token-efficient"). What did you give up? (Wall-clock per step, headed-by-default visibility, the polished agent UX.)
- The emitted-TypeScript mechanic: better or worse locators than the MCP generator produced?
- When would you still choose MCP? (Playwright's own answer: long-running exploratory loops that benefit from persistent reasoning over page structure.)

---

## Bonus Homework

1. **Auth with storage state** - extend the plan to the `/auth` sign-in flow; use `playwright-cli state-save auth.json` / `state-load` so scenarios start signed in without repeating the login UI dance.
2. **Trace forensics** - break a test, record a trace, and diagnose it *without opening a GUI*: `npx playwright trace actions --errors-only`, `trace action <id>`, `trace requests --failed` (the playwright-trace skill guides Copilot through this).
3. **Token audit** - run the same "plan search coverage" task via the 4.4 MCP agents and via the CLI skill; compare premium-request/token consumption and write down three observations.
4. **Video receipts** - re-run your green suite wrapped in `video-start` / `video-chapter "Add to cart"` / `video-stop` and get an annotated `.webm` proof of the flow - great for bug reports and demos.
5. **Annotated handoff** - use `npx playwright cli show --annotate` to draw a box on a UI oddity and type a note; the annotation lands back with the agent as a screenshot + snapshot region. File it as a UI-review finding.
6. **Cloud coding agent** - the GitHub-hosted Copilot coding agent reads skills only from `.github/skills/`; copy the `playwright-cli` skill folder there, push, and assign it an issue to add one more scenario.

## Gotchas

- **Coming from 4.4 in the same repo:** the MCP `playwright-test` server and the CLI skill coexist on disk, but with the server enabled Copilot tends to pick MCP `browser_*` tools over the skill. Disable the server in `.vscode/mcp.json` for this exercise (plans and the seed convention are shared, so your 4.4 plans still work).
- **Background-run discipline** - the `--debug=cli` test run holds the session; the playbook says to stop it when done, but a stuck paused run is the most common mess. `npx playwright cli list` then `close-all` cleans up.
- **`PLAYWRIGHT_HTML_OPEN=never`** on test runs - with the default html reporter, a failing run otherwise opens the report and blocks the terminal.
- The default `npm init playwright` config runs three browser projects; use `--project=chromium` with `--debug=cli` or you get three sequential pauses per test.
- The SUT logs a handful of console errors of its own - expect `Console: 7 errors` in CLI output; not your bug.
- **Headless by default** - the inverse of 4.4. Add `--headed` when the audience should see the browser.
- **Windows** - `&` in URLs splits commands in cmd/PowerShell; escape as `^&` (cmd) or use `--%` (PowerShell).
- Skills need **VS Code 1.108+**; on older builds the skill never triggers and Copilot free-styles instead - check the `/` menu shows `playwright-cli` before starting.

## Sources

- [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction) and [getting started](https://playwright.dev/docs/getting-started-cli)
- [Agent Skills in VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills) and the [GitHub changelog](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
- The `playwright-cli` skill and its `references/test-generation.md` in [microsoft/playwright](https://github.com/microsoft/playwright/tree/main/packages/playwright-core/src/tools/skills)
- [Release notes](https://playwright.dev/docs/release-notes) (1.59: `--debug=cli`, attach, dashboard, trace CLI; 1.62: bundled `npx playwright cli`, `init-skills`)
