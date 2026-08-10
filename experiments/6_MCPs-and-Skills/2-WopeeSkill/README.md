# Experiment 6.2: Wopee.io Skill

An agent skill (`wopee-testing`) that teaches any coding agent (Claude Code, GitHub Copilot, Cursor, OpenCode...) to run the full Wopee.io testing lifecycle: crawl the app, generate user stories and test cases, execute them with an AI browser agent, review results, and report findings (project chat, GitHub issues).

Evaluated twice against an unguided baseline:

| | April 2026 | August 2026 (rerun) |
| --- | --- | --- |
| Scenarios | 6 | 9 (incl. new-tool coverage) |
| `wopee-mcp` | 1.23.x (8 tools) | 1.29.0 (15 tools) |
| Pass rate | **93% vs 67% (+26 pts)** | **93.5% vs 71% (+22.5 pts)** |
| Speed | 2x faster | ~30% faster (median) |

The gap held across three months of MCP evolution - but its *nature* changed: richer tool descriptions let the baseline find the right tools on its own, while the skill's edge moved to **process discipline** (real crawl vs hand-written context, correct generation order, polling etiquette). Details: [EVAL_REPORT.md](./EVAL_REPORT.md).

## How the Evaluation Works

The eval process is deliberately simple and fully reproducible:

1. **Scenarios** ([evals.json](./evals.json)) - 9 realistic QA prompts ("run A001 TC001 and TC002", "build full coverage from scratch"...), each with an expected-behavior description.
2. **Two configurations per scenario** - the identical prompt runs headless (`claude -p`) from two isolated workspaces: one with the skill installed in `.claude/skills/`, one without. Same model (Claude Opus 4.6), same Wopee.io MCP server, same turn/time limits. The skill is *available*, not force-invoked - the model decides to load it, mirroring real usage.
3. **Transcript capture** - every run's full tool-call stream is recorded (which tools, what arguments, what order, what came back).
4. **Assertion grading** - each scenario has 4-5 concrete assertions ("dispatches a real crawl", "generates APP_CONTEXT before user stories", "does not mutate anything"). An analyzer model grades each assertion against the transcript - not against the final answer, which can look right while the process was wrong. Every verdict carries evidence.
5. **Aggregation** - pass rates, timings, and token counts per configuration land in [benchmark.json](./benchmark.json); assertions that could not be exercised (see pending issues) are marked blocked and excluded from the denominator.

## Files

| File | What it is |
| --- | --- |
| [SKILL.md](./SKILL.md) | The skill: all 15 tool references, workflows, polling discipline, guardrails |
| [EVAL_REPORT.md](./EVAL_REPORT.md) | August 2026 evaluation write-up incl. April comparison and findings |
| [evals.json](./evals.json) | The 9 scenario definitions |
| [benchmark.json](./benchmark.json) | Raw August run data: per-assertion verdicts with evidence, timings, tokens |
| [index.html](./index.html) | The report as a shareable web page (August headline, April per-scenario archive) |
| [infographic-1-metrics.html](./infographic-1-metrics.html) | Metrics infographic |
| [infographic-2-methodology.html](./infographic-2-methodology.html) | Methodology and comparison infographic |

## Learn more

- [Skills overview in the section README](../README.md)
- [agentskills.io](https://agentskills.io) - the open skill format

## Why Some Tools Fail With an API Key

We deep-dived the [wopee-mcp source](https://github.com/Wopee-io/wopee-mcp) and the backend API to explain the `Not Authorised!` errors. Short version: **a Wopee.io project API key does not authorize every MCP tool, and no key scope exists that changes this**. The API gates each GraphQL field individually (graphql-shield): suite, artifact, variables, and dispatch fields accept a project API key, but execution-results fields (`fetchExecutedTestCases`, `fetchRecentExecutedTestCases`) and chat fields are hardcoded to require a logged-in user session (JWT). So `wopee_fetch_executed_test_cases`, `wopee_fetch_recent_executions`, `wopee_read_chat_history`, and `wopee_send_chat_message` always fail when the server runs on `WOPEE_API_KEY` alone. Two side effects worth knowing:

- `wopee_fetch_test_inventory` silently degrades under an API key: it swallows the execution-data rejection and reports **every test as `NOT_RUN`**, even ones that ran.
- `wopee_create_github_issue` targets a mutation that no longer exists in the API; it cannot work regardless of auth.

Workaround: the undocumented `WOPEE_AUTH_TOKEN` env var (a user JWT) takes precedence over the API key and passes the user-auth checks. Proper fix: backend work to extend the api-key allowlist and resolver paths, as was already done for the variables endpoints in `wopee-mcp` 1.28.0.

## Pending Issues (to resolve later)

- [ ] **11 assertions across evals 3, 4, 8, 9 remain blocked** (marked in [benchmark.json](./benchmark.json)) - regradeable once the backend adds api-key paths for execution/chat fields, or by rerunning with a `WOPEE_AUTH_TOKEN` user JWT.
- [ ] **Backend follow-ups surfaced by this eval** - api-key access for execution-results and chat fields; three `generate*` mutations missing from the api-key allowlist (`generateTestCases`, `generateReusableTestCases`, `generateReusableTestCaseSteps` - matches the intermittent `wopee_generate_artifact` failures); `createGitHubIssue` either restored in the API or removed from wopee-mcp; `wopee_fetch_test_inventory` should surface the auth failure instead of silently reporting NOT_RUN.
- [ ] **Per-scenario cards in index.html show the April run** - the page's headline layer is updated to August; the embedded scenario-detail dataset stays the April archive until the blocked evals are regraded.
- [ ] **Eval 9 (GitHub issue creation) has never run end to end** - blocked on the missing mutation above plus issue-creation permission on the connected repo.
