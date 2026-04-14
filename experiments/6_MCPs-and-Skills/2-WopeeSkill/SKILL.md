---
name: wopee-fooddash-testing
description: "End-to-end AI test automation for the FoodDash web app using Wopee.io. Use this skill whenever the user wants to test, analyze, or QA the FoodDash application — including crawling the app, generating user stories and test cases, executing tests with an AI browser agent, or reviewing test results. Trigger on mentions of: Wopee, FoodDash, test suite, test cases, user stories, run tests, test results, QA, analysis suite, crawl the app, or any request to verify FoodDash functionality."
---

# Wopee.io FoodDash Testing

This skill orchestrates AI-powered test automation for the FoodDash web application (https://foodora.lovable.app/) using the Wopee.io platform. It covers the full testing lifecycle: analyzing the app, generating test artifacts, executing tests via an autonomous browser agent, and reviewing results.

## Important: Use the correct MCP namespace

All tool calls MUST use the **workspace-specific** MCP prefix:

```
mcp__Wopee_io_-_FoodDash__wopee_*
```

Do NOT use `mcp__wopee__wopee_*` — that points to a different project. Getting this wrong means you'll be working with the wrong test suites entirely.

## Tools Available

| Tool | Purpose |
|---|---|
| `wopee_fetch_analysis_suites` | List all existing suites (no params needed) |
| `wopee_dispatch_analysis` | Crawl the live app and create a new analysis suite |
| `wopee_create_blank_suite` | Create an empty suite for manual population |
| `wopee_generate_artifact` | AI-generate test artifacts for a suite |
| `wopee_fetch_artifact` | Retrieve generated artifacts to review |
| `wopee_update_artifact` | Replace artifact content (destructive overwrite) |
| `wopee_dispatch_agent` | Execute test cases with an AI browser agent |
| `wopee_fetch_executed_test_cases` | Get test execution results |

## Workflow Overview

The typical end-to-end flow has four phases. You can start at any phase depending on what already exists.

### Phase 1: Discover or Create a Suite

**Start here.** Always check what already exists before creating new suites.

1. Call `wopee_fetch_analysis_suites` to list existing suites.
2. Present a summary to the user showing each suite's name, analysis identifier (e.g., A001), creation date, and which artifacts have been generated.
3. If the user wants to work with an existing suite, note its `uuid` and `analysisIdentifier` — you'll need both for later steps.
4. If the user wants a fresh analysis:
   - Use `wopee_dispatch_analysis` to crawl the live app. You can optionally pass a starting URL, login credentials, cookie preferences, and free-text instructions to guide the crawl.
   - This creates a new suite AND starts crawling in one step.
   - **Always pass `additionalInstructions`** with relevant context about what to focus on, any known credentials, areas of interest, or special behaviors. This guides the AI crawler to produce more useful results. Even a brief instruction like "Focus on authentication flows and form validation" is better than leaving it empty.
5. If the user wants to **re-run** an existing analysis (e.g., after app changes):
   - Use `wopee_dispatch_analysis` with the `rerun` parameter, providing the existing `suiteUuid`, `analysisIdentifier`, and a `mode`. This re-crawls the app and updates the existing suite rather than creating a new one.
   - **Always pass `additionalInstructions`** when re-running too — tell the crawler what changed or what to pay attention to (e.g., "The forgot-password flow was recently updated, pay extra attention to that area").
6. If the user wants to build a suite manually, use `wopee_create_blank_suite`.

**When the user refers to a suite by its analysis identifier** (e.g., "A001"), look it up in the suites list to resolve the corresponding UUID. Users will typically refer to suites by identifier, not UUID.

### Phase 2: Generate Test Artifacts

Artifacts must be generated in a specific order because each layer builds on the previous one. Generating out of order produces lower quality results.

**Required generation order:**

1. **APP_CONTEXT** — The AI analyzes the app and produces a structured description of pages, elements, and user flows. This is the foundation for everything else.
2. **GENERAL_USER_STORIES** — High-level user stories organized by feature area, with acceptance criteria.
3. **USER_STORIES_WITH_TEST_CASES** — Detailed user stories with concrete test cases and step-by-step actions.

**Optional additional artifacts (generate after the above):**

4. **TEST_CASES** — Standalone test cases extracted from user stories.
5. **TEST_CASE_STEPS** — Granular step definitions for test cases.
6. **REUSABLE_TEST_CASES** — Cross-cutting test cases that can be referenced by multiple stories.
7. **REUSABLE_TEST_CASE_STEPS** — Steps for reusable test cases.

For each artifact type, call `wopee_generate_artifact` with the suite UUID and the type. Generation is asynchronous — after triggering it, use `wopee_fetch_artifact` to check if the content is ready.

**To review artifacts**, call `wopee_fetch_artifact` with the suite UUID and one of these types:
- `APP_CONTEXT` — returns the application context report (markdown)
- `GENERAL_USER_STORIES` — returns high-level user stories (markdown)
- `USER_STORIES` — returns user stories with full test cases and steps (JSON)
- `PLAYWRIGHT_CODE` — returns generated Playwright test code (requires an identifier like `US001:TC001`)
- `PROJECT_CONTEXT` — returns project-level context

**To edit artifacts**, use `wopee_update_artifact`. This is a full replacement — fetch the current content first, modify it, then send the complete updated content back.

### Phase 3: Execute Tests

Once a suite has test cases with steps (from USER_STORIES_WITH_TEST_CASES generation), you can dispatch the AI browser agent to execute them.

**Users will typically refer to tests by their short IDs** — e.g., "run A001 TC001" or "execute US001:TC003 from A001". Parse these references to build the dispatch call:
- The `A___` part is the `analysisIdentifier` — use it to look up the suite UUID from the suites list.
- The `US___` part is the `userStoryId`.
- The `TC___` part is the `testCaseId`.

If the user only provides a TC id without a US id, fetch the USER_STORIES artifact to find which user story contains that test case.

Call `wopee_dispatch_agent` with:
- `suiteUuid` — the suite's UUID (resolved from the analysis identifier)
- `analysisIdentifier` — e.g., "A001"
- `testCases` — an array of `{ userStoryId, testCaseId }` objects

Example:
```json
{
  "suiteUuid": "e7d70d56-...",
  "analysisIdentifier": "A001",
  "testCases": [
    { "userStoryId": "US001", "testCaseId": "TC001" },
    { "userStoryId": "US001", "testCaseId": "TC002" }
  ]
}
```

**Rate limit:** Wait at least 10 seconds between dispatch calls. Concurrent calls auto-retry with exponential backoff, but spacing them out is more reliable.

The agent opens a real browser, navigates the app, follows each test case's steps, captures screenshots, and reports pass/fail with detailed findings.

### Phase 4: Review Results

After dispatching tests, check results with `wopee_fetch_executed_test_cases`:
- Pass the `suiteUuid` (required) and optionally the `analysisIdentifier` to filter.
- Each result includes: execution status (`IN_PROGRESS`, `FINISHED`, `FAILED`), an agent report (natural language findings), and a code report (technical details).
- If status is `IN_PROGRESS`, wait and call again.

Present results to the user in a clear format, highlighting any failures and the agent's findings.

## Common User Requests and How to Handle Them

**"What test suites do we have?"**
→ Call `wopee_fetch_analysis_suites`, summarize the results.

**"Analyze the app" / "Crawl FoodDash"**
→ Call `wopee_dispatch_analysis` with `additionalInstructions` describing what the crawler should focus on (ask the user if unclear). Always provide instructions — they significantly improve crawl quality.

**"Re-run the analysis for A001"**
→ Call `wopee_dispatch_analysis` with the `rerun` parameter, passing the suite UUID and analysis identifier from A001. Include `additionalInstructions` describing what changed or what to pay attention to during the re-crawl.

**"Generate test cases" / "Create user stories"**
→ Check if APP_CONTEXT exists first. If not, generate it, then generate GENERAL_USER_STORIES, then USER_STORIES_WITH_TEST_CASES in sequence.

**"Run A001 TC001" / "Execute US001:TC003"**
→ Resolve the analysis identifier to a suite UUID, fetch USER_STORIES if needed to map TC to US ids, then dispatch with `wopee_dispatch_agent`.

**"Run the tests" / "Execute test cases"**
→ Fetch the USER_STORIES artifact to see available test cases, present them to the user for selection, then dispatch with `wopee_dispatch_agent`.

**"Show me the results" / "How did the tests go?" / "Get results for A001"**
→ Call `wopee_fetch_executed_test_cases` with the suite UUID (and optionally the analysis identifier to filter). Present each test case's status, the agent's natural language report, and any technical findings. Highlight failures prominently.

**"Compare results against requirements" / "Coverage analysis"**
→ Fetch the USER_STORIES artifact to get the full list of test cases and their expected behaviors. Also fetch executed test case results. Cross-reference what's been tested vs. what exists — identify untested stories, failing tests, and gaps. If the user provides external requirements or bug reports, compare the test coverage against those to find missing scenarios.

**"Update this test case" / "Edit the user stories"**
→ Fetch the current artifact, apply the user's changes, then call `wopee_update_artifact` with the full updated content.

## Tips

- Always confirm the suite UUID before making changes — working on the wrong suite is the most common mistake.
- When presenting test cases to the user, include the user story ID and test case ID (e.g., US001:TC001) so they can easily reference specific tests.
- The `analysisIdentifier` (e.g., A001) is different from the suite UUID. You need both for dispatching agents — the UUID to identify the suite and the identifier for the specific analysis run.
- Reusable test cases (R001:RTC001 etc.) can be referenced across multiple user stories — they're useful for common flows like login.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `wopee_dispatch_analysis` returns but no artifacts appear | Crawl is still running | Wait 1-2 minutes, then call `wopee_fetch_artifact` to check |
| `wopee_dispatch_agent` fails with 429 | Rate limit hit | Wait 2 minutes between dispatch calls, apply exponential backoff if needed |
| Artifact content is empty or incomplete | Generated too early — previous artifact not ready | Ensure generation order: APP_CONTEXT → USER_STORIES → TEST_CASES |
| Wrong test suite data returned | Using wrong MCP namespace | Verify prefix is `mcp__Wopee_io_-_FoodDash__wopee_*` |
| Suite UUID not found | Using analysis identifier instead of UUID | Call `wopee_fetch_analysis_suites` to resolve A001 → UUID |
| Agent dispatched but status stays `IN_PROGRESS` | Test execution takes time | Wait 30-60 seconds, then call `wopee_fetch_executed_test_cases` again |
