---
name: issue-reporting
description: >
  GitHub issue reporting guidelines — title conventions, body templates, labels,
  and agent workflow for creating well-structured issues. Use when creating GitHub
  issues, filing bugs, requesting features, or structuring issue bodies.
---

# Issue Reporting Skill

Guidelines for AI agents and humans to create consistent, well-structured GitHub issues.

---

## Tools

- `gh issue create` — Create issues with title, body, labels, and type
- `gh issue list --search` — Search for duplicates before creating new ones
- `gh issue comment` — Add context to existing issues instead of creating duplicates

---

## Rules

- **GitHub Issues is the single system of record** — never create markdown files or other docs to track issues
- Always search for existing open issues before creating a new one — add a comment if a match exists
- Every issue must have a body — never create empty-body issues
- Always set a priority label (`prio A`/`B`/`C`) on bug issues
- Use `/` (not `,`) as separator for cross-component prefixes, primary component first
- Always present issue drafts to the user for review before creating
- English only — translate user feedback if given in another language

---

## Title Convention

**Pattern:** `[component] Imperative description of the change or problem`

### Component Prefixes (example)

| Prefix      | Area                           | Example                                          |
| ----------- | ------------------------------ | ------------------------------------------------ |
| `[frontend]` | UI / web client                | `[frontend] Add loading spinner to dashboard`    |
| `[api]`      | Backend / REST / GraphQL       | `[api] Fix timeout on large queries`             |
| `[agent]`    | AI agent / automation          | `[agent] Handle flaky selectors gracefully`      |
| `[mcp]`      | MCP server                     | `[mcp] Add pagination to fetch endpoint`         |
| `[docs]`     | Documentation                  | `[docs] Update installation guide for v3`        |
| `[infra]`    | CI/CD / DevOps / infrastructure | `[infra] Upgrade Node.js to 22 in CI runners`   |

### Cross-component Issues

Use **slash** (`/`) as separator, primary component first:

- `[frontend/api]` — UI issue that requires API changes
- `[api/agent]` — Backend change affecting the agent

### Title Rules

1. **Start with an imperative verb:** Add, Fix, Implement, Remove, Update, Refactor
2. **Be specific:** `[frontend] Fix table header styling` not ~~`[frontend] Fix UI`~~
3. **No prefix-only titles:** ~~`[agent]`~~ with no description is not acceptable
4. **No vague titles:** ~~`[agent] Bugfix, improvements`~~ — describe what's changing
5. **English only** — translate if the original is in another language
6. **No trailing punctuation**

### Good vs Bad Examples

| Quality | Title                                                        |
| ------- | ------------------------------------------------------------ |
| Good    | `[frontend] Display error message when crawling fails`       |
| Good    | `[api] Increase timeout for large diff processing`           |
| Good    | `[frontend/api] Implement auto-save for instruction changes` |
| Bad     | `[agent]` (no description)                                   |
| Bad     | `[frontend] Fix bug` (too vague)                             |
| Bad     | `[aget,frontend,api] stuff` (typo + comma + vague)           |

---

## Issue Body Templates

Every issue **must** have a body. Use the appropriate template:

### Bug Report

```markdown
## Description

[One sentence: what is broken]

## Steps to Reproduce

1. Go to ...
2. Click on ...
3. Observe ...

## Expected behavior

[What should happen]

## Actual behavior

[What happens instead]

## Screenshots / Logs

[Attach screenshots, paste error messages, link to traces]

## Environment

- Browser: Chrome / Firefox
- OS: macOS / Windows / Linux
```

### Feature Request

```markdown
## Description

[What capability is missing or desired]

## Use Case

[Why is this needed? Who benefits?]

## Proposed Solution

[How should it work? Include mockups if relevant]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

### Task / Chore

```markdown
## Description

[What needs to be done and why]

## Scope

- [ ] Step 1
- [ ] Step 2

## Notes

[Any relevant context, links, or dependencies]
```

---

## Issue Types

| Type        | When to use                                   |
| ----------- | --------------------------------------------- |
| **Bug**     | Something is broken or behaves unexpectedly   |
| **Feature** | New capability or significant enhancement     |
| **Task**    | Maintenance, refactoring, infrastructure work |

---

## Labels

### Priority (required for bugs)

| Label    | Meaning                                      | SLA               |
| -------- | -------------------------------------------- | ------------------ |
| `prio A` | Critical — blocks users or revenue           | Fix within 24h     |
| `prio B` | Important — significant impact, workaround exists | Fix within 1 week |
| `prio C` | Nice to have — cosmetic or minor             | Backlog            |

### Category (recommended)

| Label         | Use for                       |
| ------------- | ----------------------------- |
| `bug`         | Defects and regressions       |
| `ui`          | Visual / layout issues        |
| `ux`          | Usability and workflow issues |
| `performance` | Speed / resource issues       |
| `security`    | Security vulnerabilities      |

---

## Agent Workflow for Creating Issues

When an AI agent creates issues on behalf of a user:

1. **Translate** the user's description into English
2. **Determine the component** from context (screenshot, app area, conversation)
3. **Apply the title pattern:** `[component] Imperative description`
4. **Fill out the body** using the appropriate template above
5. **Set type** (Bug / Feature / Task)
6. **Set priority label** if it's a bug
7. **Search for duplicates** before creating
8. **Present draft** to the user for review before creating

### Mapping User Feedback to Components

| User says...                                      | Component    |
| ------------------------------------------------- | ------------ |
| "the app", "dashboard", "UI", "button"            | `[frontend]` |
| "the API", "backend", "server error"              | `[api]`      |
| "the agent", "crawling", "automation", "execution" | `[agent]`    |
| "documentation", "docs", "help page"              | `[docs]`     |
| "MCP", "AI tool", "integration"                   | `[mcp]`      |
| "CI", "deployment", "Docker", "pipeline"          | `[infra]`    |

---

## Why This Matters

Analysis of ~500 issues in a real product backlog found:

| Finding                    | Impact                           | Recommendation               |
| -------------------------- | -------------------------------- | ---------------------------- |
| 64.5% issues have no body  | Hard to understand context later | Require body via template    |
| 65.5% have no type         | Can't filter by Bug/Feature/Task | Always set type              |
| 84% have no labels         | No priority visibility           | Set priority on all bugs     |
| Inconsistent separators    | Breaks filtering                 | Standardize on `/`           |
| 12 prefix-only titles      | Zero information                 | Enforce minimum title length |
| Typos in prefixes          | Breaks filtering                 | Copy prefix from the list    |

This skill prevents these problems by teaching agents the conventions upfront.
