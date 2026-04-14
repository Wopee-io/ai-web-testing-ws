# Wopee.io Skill Evaluation Report

**Skill:** `wopee-fooddash-testing`
**Application:** FoodDash ([foodora.lovable.app](https://foodora.lovable.app/))
**Model:** Claude Opus 4.6
**Date:** April 13, 2026

---

## Overview

We built a custom Claude skill that guides AI agents through Wopee.io's test automation platform — covering app analysis, test artifact generation, test execution, and result review. To measure its impact, we ran 6 real-world QA scenarios twice each: once with the skill loaded, once without. Both configurations used the same model, the same MCP tools, and the same prompts. We graded 27 assertions against actual tool call transcripts.

### Headline Results

| Metric | With Skill | Baseline | Delta |
|--------|-----------|----------|-------|
| **Pass Rate** | 93% | 67% | **+26 pts** |
| **Avg Execution Time** | 52.7s | 109.2s | **2x faster** |
| **Avg Token Usage** | 60,383 | 70,783 | **-15%** |

---

## Evaluation Scenarios

### Eval 1 — List Suites

**Prompt:** *"What test suites exist in the FoodDash project? Show me what's been generated for each one."*

| | With Skill | Baseline |
|---|-----------|----------|
| **Pass Rate** | 100% (4/4) | 100% (4/4) |
| **Time** | 22.5s | 36.8s |
| **Tokens** | 55,454 | 64,184 |

| Assertion | With Skill | Baseline |
|-----------|:---:|:---:|
| Uses correct `mcp__Wopee_io_-_FoodDash__` namespace | PASS | PASS |
| Calls `wopee_fetch_analysis_suites` | PASS | PASS |
| Presents suite names and analysis identifiers | PASS | PASS |
| Shows artifact generation status | PASS | PASS |

**Takeaway:** Both configurations handle this simple discovery task well. The skill is 39% faster since it doesn't explore unnecessary tools.

---

### Eval 2 — Generate Full Test Coverage

**Prompt:** *"I want to generate full test coverage for the FoodDash app. Start from scratch — analyze the app and build out user stories and test cases."*

| | With Skill | Baseline |
|---|-----------|----------|
| **Pass Rate** | 60% (3/5) | 20% (1/5) |
| **Time** | 93.0s | 269.4s |
| **Tokens** | 73,526 | 103,634 |

| Assertion | With Skill | Baseline |
|-----------|:---:|:---:|
| Uses correct `mcp__Wopee_io_-_FoodDash__` namespace | PASS | FAIL |
| Calls `wopee_dispatch_analysis` to start crawl | PASS | FAIL |
| Generates APP_CONTEXT before user stories | FAIL | FAIL |
| Generates GENERAL_USER_STORIES before test cases | PASS | PASS |
| Follows correct artifact generation order | FAIL | FAIL |

**Takeaway:** The skill's biggest advantage here is namespace accuracy and knowing to use `dispatch_analysis` (the baseline used `create_blank_suite` on the wrong namespace). Both struggled with strict artifact ordering — an area for skill improvement. Still, the skill scored 3x higher and completed nearly 3x faster.

---

### Eval 3 — Run Tests by ID

**Prompt:** *"Run A001 TC001 and TC002 from US001."*

| | With Skill | Baseline |
|---|-----------|----------|
| **Pass Rate** | 100% (5/5) | 80% (4/5) |
| **Time** | 48.3s | 51.5s |
| **Tokens** | 56,188 | 62,324 |

| Assertion | With Skill | Baseline |
|-----------|:---:|:---:|
| Uses correct `mcp__Wopee_io_-_FoodDash__` namespace | PASS | FAIL |
| Resolves A001 to suite UUID via suites list | PASS | PASS |
| Dispatches agent for US001:TC001 and US001:TC002 | PASS | PASS |
| Uses correct analysisIdentifier A001 | PASS | PASS |
| Fetches execution results after dispatching | PASS | PASS |

**Takeaway:** The baseline mostly succeeded here but mixed in one `mcp__wopee__` call for fetching results, which would have queried the wrong project's data. The skill prevented this entirely.

---

### Eval 4 — Fetch Test Results

**Prompt:** *"Show me the latest test results for A001. Which tests passed and which failed?"*

| | With Skill | Baseline |
|---|-----------|----------|
| **Pass Rate** | 100% (4/4) | 50% (2/4) |
| **Time** | 25.1s | 43.0s |
| **Tokens** | 55,333 | 61,079 |

| Assertion | With Skill | Baseline |
|-----------|:---:|:---:|
| Uses correct `mcp__Wopee_io_-_FoodDash__` namespace | PASS | FAIL |
| Resolves A001 to its suite UUID | PASS | PASS |
| Calls `wopee_fetch_executed_test_cases` | PASS | FAIL |
| Presents pass/fail status for each test case | PASS | PASS |

**Takeaway:** The baseline mixed namespaces and failed to call the correct result-fetching tool. The skill completed the task cleanly in half the time.

---

### Eval 5 — Re-run Analysis

**Prompt:** *"The app was just updated. Re-run the analysis for A001 to pick up the changes, then regenerate the test cases."*

| | With Skill | Baseline |
|---|-----------|----------|
| **Pass Rate** | 100% (4/4) | 50% (2/4) |
| **Time** | 61.3s | 174.7s |
| **Tokens** | 56,239 | 71,361 |

| Assertion | With Skill | Baseline |
|-----------|:---:|:---:|
| Uses correct `mcp__Wopee_io_-_FoodDash__` namespace | PASS | PASS |
| Uses `dispatch_analysis` with rerun parameter | PASS | FAIL |
| References A001 suite UUID and identifier in rerun | PASS | FAIL |
| Regenerates artifacts in correct order | PASS | PASS |

**Takeaway:** This is where the skill's domain knowledge matters most. The baseline created an entirely new suite (A005) instead of re-running A001, losing suite continuity and history. The skill knew to use the `rerun` parameter, completing the task 2.8x faster.

---

### Eval 6 — Coverage vs Bug Report

**Prompt:** *"We got a bug report that the forgot-password link is broken. Check if we have test coverage for that in A001, and if so, run those specific tests."*

| | With Skill | Baseline |
|---|-----------|----------|
| **Pass Rate** | 100% (5/5) | 100% (5/5) |
| **Time** | 66.2s | 79.8s |
| **Tokens** | 65,555 | 62,118 |

| Assertion | With Skill | Baseline |
|-----------|:---:|:---:|
| Uses correct `mcp__Wopee_io_-_FoodDash__` namespace | PASS | PASS |
| Fetches USER_STORIES to examine coverage | PASS | PASS |
| Identifies US001:TC004 (forgot-password) | PASS | PASS |
| Dispatches agent for relevant test cases | PASS | PASS |
| Reports coverage match against bug report | PASS | PASS |

**Takeaway:** Both configurations handled this well. The task is concrete enough ("forgot-password" maps clearly to a test case name) that the agent found its way without skill guidance. The skill was slightly faster.

---

## Summary by Scenario

| # | Scenario | With Skill | Baseline | Delta |
|---|----------|:---:|:---:|:---:|
| 1 | List Suites | 100% | 100% | tied |
| 2 | Generate Coverage | 60% | 20% | **+40 pts** |
| 3 | Run Tests by ID | 100% | 80% | **+20 pts** |
| 4 | Fetch Results | 100% | 50% | **+50 pts** |
| 5 | Re-run Analysis | 100% | 50% | **+50 pts** |
| 6 | Coverage vs Bug | 100% | 100% | tied |
| | **Average** | **93%** | **67%** | **+26 pts** |

---

## Key Findings

### 1. MCP Namespace Routing Is the #1 Failure Mode

The most common baseline failure was using the wrong MCP namespace. The FoodDash project requires `mcp__Wopee_io_-_FoodDash__` tools, but agents without the skill frequently mixed in `mcp__wopee__` calls — which silently route to a different project with different suites and data. This caused failures in evals 2, 3, and 4. The skill eliminates this entirely by explicitly instructing which namespace to use.

### 2. Domain Knowledge Enables Correct Tool Sequencing

The Wopee.io platform has implicit dependencies (artifact generation order, rerun vs new suite, resolving short IDs to UUIDs) that aren't obvious from the tool descriptions alone. The skill encodes this knowledge so agents follow the correct workflow without trial and error.

### 3. Skills Make Agents Faster and Cheaper

Skill-guided agents averaged 52.7s per task vs 109.2s baseline — a 2x speedup. They also consumed 15% fewer tokens. The efficiency gain comes from eliminating exploratory tool calls and reducing error-recovery cycles.

### 4. Simple Tasks Don't Need Skills

Evals 1 and 6 show that for straightforward tasks (listing suites, searching for a named test case), the baseline performs equally well. The skill's value concentrates on multi-step workflows where ordering, namespace choice, and parameter knowledge matter.

---

## Methodology

**Setup:** 6 evaluation scenarios, each run as two independent Claude Opus 4.6 agent sessions — one with the skill loaded into context, one without. Both had access to the same Wopee.io MCP tools.

**Execution:** All 12 runs launched in parallel. Each agent recorded a full transcript of tool calls made, parameters used, responses received, and final output.

**Grading:** 27 assertions graded against actual tool call transcripts (not self-reported output). Each assertion checked a specific behavior: correct namespace, correct tool, correct parameter, correct sequencing.

**Metrics captured:** Pass rate (assertions passed / total), wall-clock execution time, and token consumption per run.

---

## Skill Improvements Made During Evaluation

Based on findings from the eval runs, two improvements were applied to the skill before final packaging:

1. **`additionalInstructions` guidance** — The skill now instructs agents to always pass `additionalInstructions` when dispatching or re-running analysis, providing the crawler with focus areas and context. This improves crawl quality.

2. **Short ID resolution guidance** — Added explicit instructions for mapping user-friendly references (A001, TC001, US001) to internal UUIDs, including handling cases where only a TC id is provided without a US id.

---

## Files in This Report

| File | Description |
|------|-------------|
| `EVAL_REPORT.md` | This report |
| `index.html` | Interactive evaluation dashboard |
| `infographic-1-metrics.html` | Slide-ready metrics infographic (1920x1080) |
| `infographic-2-methodology.html` | Slide-ready methodology infographic (1920x1080) |
| `benchmark.json` | Raw benchmark data (all 12 runs with assertions) |
| `evals.json` | The 6 evaluation prompts and expected outputs |
| `SKILL.md` | The evaluated skill |
