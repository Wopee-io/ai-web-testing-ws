# Experiment 6.2: Wopee.io Skill

An agent skill (`wopee-fooddash-testing`) that teaches any coding agent (Claude Code, GitHub Copilot, Cursor, OpenCode...) to run the full Wopee.io testing lifecycle for the FoodDash demo app ([foodora.lovable.app](https://foodora.lovable.app/)): crawl the app, generate user stories and test cases, execute them with an AI browser agent, and review results.

We evaluated the skill against an unguided baseline (same model, same MCP tools, same prompts, 6 scenarios, 27 graded assertions): **93% vs 67% pass rate (+26 pts), 2x faster, -15% tokens**. Snapshot from April 2026: executor Claude Opus 4.6, `wopee-mcp` 1.23.x (8 tools at the time).

## Files

| File | What it is |
| --- | --- |
| [SKILL.md](./SKILL.md) | The skill itself: tool reference, workflows, guardrails |
| [EVAL_REPORT.md](./EVAL_REPORT.md) | Full evaluation write-up: scenarios, results, takeaways |
| [index.html](./index.html) | The report as a shareable web page |
| [infographic-1-metrics.html](./infographic-1-metrics.html) | Metrics infographic |
| [infographic-2-methodology.html](./infographic-2-methodology.html) | Methodology and comparison infographic |
| [benchmark.json](./benchmark.json) | Raw run data (timings, tokens, tool calls) |
| [evals.json](./evals.json) | Assertion definitions used for grading |

## Learn more

- [Skills overview in the section README](../README.md)
- [agentskills.io](https://agentskills.io) - the open skill format

## Pending Issues (to resolve later)

A refresh of this experiment is in progress. Already refreshed in this folder: `SKILL.md` (generalized `wopee-testing` skill covering all 15 MCP tools) and `evals.json` (9 scenarios incl. the new tools). Still pending:

- [ ] **Benchmark rerun is partially blocked** - the rerun on `wopee-mcp` 1.29.0 found the workshop API key lacks scopes for execution results, project chat, and GitHub issue creation; evals 3, 4, 8, 9 await a full-scope key.
- [ ] **Report artifacts are still the April 2026 snapshot** - `EVAL_REPORT.md`, `benchmark.json`, `index.html`, and both infographics describe the original 6-scenario run (Claude Opus 4.6, wopee-mcp 1.23.x, the retired FoodDash project) and will be regenerated once the rerun completes. Until then they intentionally do not match the refreshed `SKILL.md`/`evals.json`.
- [ ] **Skill gap found during rerun, fix pending validation** - the skill needs explicit poll-with-backoff guidance: one run polled `wopee_fetch_analysis_suites` ~30 times in a tight loop waiting for a re-crawl to finish.
- [ ] **Expected outcome of the rerun** - a smaller skill-vs-baseline gap on read scenarios (the 1.29.0 tool descriptions are much richer) and a persistent gap on process discipline (the unguided baseline skipped the real crawl and hand-wrote the app context).
