---
name: youtrack-issues
description: >
  Work with YouTrack issues through the YouTrack MCP server — search without
  creating duplicates, report bugs found while testing the Foodora demo app
  with reproducible steps and test evidence, comment test results back to the
  ticket. Use when the user mentions YouTrack, a YouTrack issue ID (e.g. DEMO-42),
  filing a bug in YouTrack, reporting a test failure, or triaging a YouTrack backlog.
---

# YouTrack Issues Skill

Report and triage issues in YouTrack via the `youtrack` MCP server — tuned for testing the workshop SUT, **Foodora** ([foodora.lovable.app](https://foodora.lovable.app/)).

Setup (endpoint, permanent token, `.env`): see [README.md](./README.md).

## Rules

- **Search before you create** — `search_issues` with the key words of the problem; comment on the existing issue instead of opening a duplicate
- **Never create an issue with an empty description** — use the templates below
- **Present the draft and wait for approval** before calling `create_issue`
- **English only** — translate the user's wording if needed
- **One problem = one issue** — do not bundle unrelated findings
- **A failing test is not automatically a bug** — first decide: app defect, stale test, or flaky run. Only app defects become issues; say which of the three you concluded and why
- Read the project's fields with `get_issue_fields_schema` before setting Priority / Type / State — field names and values differ per project
- Never print the permanent token

## Tools

| Task                   | Tool                                        |
| ---------------------- | ------------------------------------------- |
| Find issues            | `search_issues` (YouTrack query syntax)     |
| Read one issue         | `get_issue`, `get_issue_comments`           |
| Report a bug           | `create_issue`                              |
| Update fields / state  | `update_issue`, `change_issue_assignee`     |
| Post results           | `add_issue_comment`                         |
| Discover custom fields | `get_issue_fields_schema`                   |
| Projects / users       | `find_projects`, `get_project`, `find_user` |

## Summary Convention

**Pattern:** `<Area>: <imperative, specific description>` — no trailing period.

### Foodora Area Prefixes

| Prefix        | Covers                                              | Example summary                                            |
| ------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `Search`      | Search box, results, empty states                   | `Search: no results shown for valid restaurant name`       |
| `Filters`     | Category chips (Pizza, Burgers, Sushi...)           | `Filters: Pizza filter also shows Mediterranean cards`     |
| `Restaurants` | Cards, ratings, detail pages, menus                 | `Restaurants: rating badge missing on detail page`         |
| `Cart`        | Cart icon, badge count, add/remove items            | `Cart: total is not recalculated after removing an item`   |
| `Checkout`    | Order placement, payment, confirmation              | `Checkout: order button stays disabled with valid address` |
| `Auth`        | `/auth` sign-in and sign-up flows                   | `Auth: no error message on wrong password`                 |
| `Promo`       | Promo banners, discount logic (20% off, free dessert) | `Promo: 20% discount not applied above $25`              |
| `Delivery`    | Delivery fees, time estimates                       | `Delivery: fee shows $NaN for Pizza Corner`                |
| `Tests`       | Test infrastructure itself (flaky specs, stale locators) | `Tests: checkout spec relies on removed data-testid`  |

Cross-area problems: primary area first, `/` separator — `Cart/Promo: discount banner overlaps cart badge`.

### Good vs Bad

| Quality | Summary                                                |
| ------- | ------------------------------------------------------ |
| Good    | `Cart: badge count stuck at 1 after adding second item` |
| Good    | `Auth: sign-in accepts empty password field`           |
| Bad     | `bug in cart` (no area, vague)                         |
| Bad     | `Cart:` (prefix only)                                  |
| Bad     | `Checkout broken, also filters weird` (two problems)   |

## Priority Guide (Foodora flows)

Check actual values with `get_issue_fields_schema` first; map severity like this:

| Priority     | When (Foodora examples)                                                | Example                       |
| ------------ | ---------------------------------------------------------------------- | ----------------------------- |
| **Show-stopper** | (where the project has it, above Critical) App unusable as a whole: nothing loads, data loss | Site down, all orders lost |
| **Critical** | Revenue path broken: checkout fails, cart unusable, sign-in impossible | Checkout button dead for all  |
| **Major**    | Feature broken with workaround: one filter wrong, search misses results | Pizza filter shows wrong cards |
| **Normal**   | Cosmetic or partial: layout glitch, wrong rating display               | Rating stars misaligned       |
| **Minor**    | Polish: typos, spacing, non-blocking console errors                    | "Restuarant" typo in footer   |

## Bug Template

Description body — every section filled, evidence is not optional when the bug came from a test run:

```markdown
## Steps to Reproduce

1. Go to https://foodora.lovable.app/
2. Click ...
3. Observe ...

## Expected

[what should happen]

## Actual

[what happens instead]

## Environment

- URL / build: https://foodora.lovable.app/
- Browser + OS:

## Test Evidence

- Test id: [Playwright spec path + test title, or Wopee US001:TC003, or "manual"]
- Run: [execution date/time, Wopee execution id or CI run link]
- Artifacts: [screenshot path, trace file, agent report excerpt]

## Agent Findings

[if an AI agent found this: its verdict verbatim, plus your assessment of whether the test or the app is at fault]
```

## Test-Result Comment Template

When a run relates to an existing issue, comment — do not silently change state:

```markdown
**Test verdict:** PASS / FAIL — [date]

- Ran: [test ids, e.g. US001:TC001, TC002 or spec paths]
- Result: [1 passed, 1 failed — what failed and how]
- Evidence: [screenshot/trace/agent report]
- Conclusion: [fixed / still reproducible / cannot reproduce]
```

## Query Cheatsheet

The workshop instance's project key is `DEMO` — substitute your own project key elsewhere. A query with a wrong key **parses fine and silently returns nothing**, so confirm the key via `find_projects` first (it takes a search `query` argument; an empty string lists all).

```text
project: DEMO #Unresolved                     all open issues in project DEMO
project: DEMO #Bug #Unresolved                open bugs (falls back empty if no issue has Type: Bug)
project: DEMO Priority: Critical, Major       by priority
summary: cart                                 candidate duplicates for a cart bug
summary: checkout #Unresolved                 open checkout issues
assignee: me #Unresolved                      my open issues
updated: {minus 14d} .. Today                 recently touched
project: DEMO sort by: created desc           newest first
```

Duplicate search for a new finding: query the **area prefix** and the key noun (`summary: cart badge`), not the full sentence.

## Workflow

1. `get_current_user` + `find_projects` → confirm the target project
2. **Classify the finding**: app defect / stale test / flaky run. Only app defects proceed; for the others, tell the user what to fix instead (the test, or rerun)
3. `search_issues` → duplicate? then `add_issue_comment` with the new evidence (test-result template) and stop
4. Draft summary (`<Area>: ...`) + description from the bug template, including Test Evidence
5. `get_issue_fields_schema` → set Type and Priority per the guide above
6. Show the draft to the user → wait for explicit approval
7. `create_issue`, then report the created issue ID back to the user
8. When a later test run confirms or refutes the issue, `add_issue_comment` with the test-result template — never close the issue yourself unless the user asks

## Where Bugs Come From in This Workshop

| Source (experiment)                              | Evidence to attach                                        |
| ------------------------------------------------ | --------------------------------------------------------- |
| Playwright specs (3.x, 4.4, 4.5)                 | Spec path + test title, trace zip, `npx playwright trace` findings |
| Wopee.io agent runs (6.2, 6.3)                   | US/TC id, execution status, agent report excerpt          |
| Playwright MCP / CLI exploration (6.1, 4.5)      | Emitted steps, snapshot/screenshot files                  |
| Manual exploration                               | Steps + screenshot                                        |

## Why This Matters

Backlogs rot fast when agents (or humans) file issues without discipline: empty bodies, no priority, vague titles, duplicates. An analysis of ~500 issues in a real backlog found 64% had no body and 84% no labels — making them unfilterable and untriageable. Conventions cost seconds at creation time and save hours at triage time. This skill teaches agents the conventions upfront, so every filed issue is reproducible, prioritized, searchable, and traceable back to the exact test run that found it.
