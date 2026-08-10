# Wopee.io Skill Evaluation Report

**Skill:** `wopee-testing` (generalized successor of `wopee-fooddash-testing`)
**Application:** saucedemo demo project ([saucedemo.com](https://www.saucedemo.com)) via Wopee.io
**Executor model:** Claude Opus 4.6 (same as April) | **Analyzer:** Claude Opus 5
**Wopee.io MCP:** `wopee-mcp` 1.29.0 (15 tools)
**Date:** August 10, 2026 (rerun of the April 13, 2026 evaluation)

---

## Overview

We re-ran the skill-vs-baseline evaluation after three months of Wopee.io MCP evolution: the server grew from 8 to 15 tools, the skill was generalized away from the retired FoodDash project, and three new scenarios were added to cover the new tool surface (test inventory, chat summaries, GitHub issue reporting). As in April: each scenario runs twice with the same model, tools, and prompts - once with the skill available, once without - and assertions are graded against the actual tool-call transcripts.

### Headline Results (31 graded assertions per configuration)

| Metric | With Skill | Baseline | Delta |
| --- | --- | --- | --- |
| **Pass Rate** | 93.5% (29/31) | 71.0% (22/31) | **+22.5 pts** |
| **Median Execution Time** | 50.8s | 72.5s | **~30% faster** |
| **Mean Execution Time** | 102.3s | 128.4s (incl. one 420s timeout) | faster |

Token totals in `benchmark.json` include prompt-cache reads (headless CLI metric) and are **not comparable** to the April report's token figures.

### April vs August

| | April 2026 | August 2026 |
| --- | --- | --- |
| Scenarios | 6 | 9 (6 adapted + 3 new-tool) |
| `wopee-mcp` | 1.23.x (8 tools) | 1.29.0 (15 tools) |
| Pass rate gap | +26 pts (93% vs 67%) | +22.5 pts (93.5% vs 71%) |

The gap narrowed slightly but **held**. The reason it narrowed is instructive: the 1.29.0 tool descriptions are much richer (e.g. `wopee_fetch_test_inventory` describes itself as "the authoritative tool"), so the unguided baseline now finds the right read tool far more often. The reason it held is equally instructive: the skill's advantage has shifted from *tool discovery* to *process discipline* - see findings.

## Evaluation Scenarios

| # | Scenario | With Skill | Baseline |
| --- | --- | --- | --- |
| 1 | List Suites | 4/4 | 4/4 |
| 2 | Full Coverage From Scratch | 5/5 | **1/5** |
| 3 | Run Specific Tests | 3/4 | 2/4 |
| 4 | Latest Results | 2/2 graded (2 blocked) | 2/2 graded (2 blocked) |
| 5 | Rerun Analysis + Regenerate | 3/4 | 3/4 |
| 6 | Coverage Check For Bug Report | 4/4 | 4/4 |
| 7 | Test Inventory (new) | 4/4 | 4/4 |
| 8 | Recent Executions + Chat (new) | 3/3 graded (1 blocked) | 2/3 graded (1 blocked) |
| 9 | Failing Test -> GitHub Issue (new) | 1/1 graded (3 blocked) | 1/1 graded (3 blocked) |

"Blocked" assertions could not be graded because the Wopee.io API restricts execution-results and chat GraphQL fields to user-session (JWT) auth; project API keys are rejected by design and no key scope exists that changes this (verified in the backend source - see the README's "Why Some Tools Fail" section). Blocked assertions hit both configurations identically and are excluded from pass rates; regrading awaits either backend api-key paths or a rerun with a user JWT.

## Key Findings

### 1. The baseline's biggest failure is silent and looks like success

In scenario 2 ("build full coverage from scratch"), the baseline **skipped the crawl entirely**: it created a blank suite and hand-wrote the APP_CONTEXT from a quick page fetch, then generated test artifacts on top of that invented foundation. The output looked plausible (43 test cases!) but was not grounded in a real crawl of the app. The skill run dispatched a real analysis with rich `additionalInstructions`. This is exactly the failure mode a process skill exists to prevent, and it is nearly invisible in casual review.

### 2. Tool discovery no longer needs the skill; workflow discipline still does

The baseline found `wopee_fetch_test_inventory` unprompted (scenario 7) and even used the `rerun` parameter correctly (scenario 5). Richer tool descriptions have absorbed much of what the April skill taught. What the descriptions cannot teach: generation order, crawl-first discipline, one-chat-message-not-two (scenario 8 baseline double-posted), and resolving suites through the canonical listing (scenario 3).

### 3. The skill itself had a gap: polling without backoff

The with-skill run of scenario 5 polled `wopee_fetch_analysis_suites` ~30 times in a tight loop waiting for the re-crawl, burning its whole turn budget before regenerating artifacts. The refreshed skill now includes explicit wait-and-poll guidance. Evals cut both ways: this one found a bug in the skill, not the agent.

### 4. Both configurations degrade gracefully on missing permissions

When execution endpoints returned `Not Authorised!`, both runs correctly diagnosed a permissions issue, fell back to the data they could read (test inventory), and reported the limitation to the user instead of hallucinating results. Neither invented pass/fail data. One caveat discovered later in the source: `wopee_fetch_test_inventory` itself silently degrades under an API key - it reports every test as `NOT_RUN` even after tests were dispatched, so the agents' "no tests have been executed" summaries were faithful to the tool output but not to reality. The eval also explained the intermittent `wopee_generate_artifact` failures: three of the seven `generate*` mutations are missing from the API's api-key allowlist.

## Methodology Notes

- Harness: headless `claude -p` runs from isolated workspaces, one with the skill in `.claude/skills/`, one without; project-scoped MCP config; sequential execution with 15s spacing; 420s timeout; max 40 turns.
- The skill was *available*, not force-invoked: the model chose to load it in 5 of 9 with-skill runs, which mirrors real usage.
- Scenario prompts were minimally debranded from April (the FoodDash project no longer exists); original assertion intent preserved, namespace assertions replaced by tool-usage assertions.
- Raw per-run data, all 62 assertion verdicts with evidence, and aggregates: [benchmark.json](./benchmark.json). Scenario definitions: [evals.json](./evals.json).

## Takeaways

1. **Keep skills for process, not for tool lists.** Tool descriptions are self-documenting now; encode ordering, guardrails, and verification discipline instead.
2. **Evaluate skills after every major MCP upgrade.** The value proposition of this skill changed shape between 1.23 and 1.29 without a single line of the skill changing.
3. **Grade against transcripts, not final answers.** The baseline's scenario-2 answer read beautifully; only the tool-call transcript revealed the skipped crawl.
