---
name: youtrack-issues
description: >
  Work with YouTrack issues through the YouTrack MCP server — search without
  creating duplicates, report bugs with reproducible steps, comment test results
  back to the ticket. Use when the user mentions YouTrack, a YouTrack issue ID
  (e.g. WS-42), filing a bug in YouTrack, or triaging a YouTrack backlog.
---

# YouTrack Issues Skill

Report and triage issues in YouTrack via the `youtrack` MCP server.

Setup (endpoint, permanent token, `.env`): see [README.md](./README.md).

## Rules

- **Search before you create** — `search_issues` with the key words of the problem; comment on the existing issue instead of opening a duplicate
- **Never create an issue with an empty description** — use the template below
- **Present the draft and wait for approval** before calling `create_issue`
- **English only** — translate the user's wording if needed
- **One problem = one issue** — do not bundle unrelated findings
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

## Query Cheatsheet

```text
project: WS #Unresolved                  all open issues in project WS
project: WS #Bug #Unresolved             open bugs
project: WS Priority: Critical, Major    by priority
assignee: me #Unresolved                 my open issues
updated: {minus 14d} .. Today            recently touched
summary: login                           text match in the summary
project: WS sort by: created desc        newest first
```

## Bug Template

Summary: `<area>: <what is broken>` — imperative, specific, no trailing period.
Good: `Cart: total is not recalculated after removing an item`
Bad: `bug in cart`

Description:

```markdown
## Steps to Reproduce

1. Go to ...
2. Click ...
3. Observe ...

## Expected

[what should happen]

## Actual

[what happens instead]

## Environment

- URL / build:
- Browser + OS:

## Evidence

[screenshot path, trace link, error message]
```

## Workflow

1. `get_current_user` + `find_projects` → confirm the target project
2. `search_issues` → duplicate? then `add_issue_comment` with the new evidence and stop
3. Draft summary + description from the template
4. Show the draft to the user → wait for explicit approval
5. `create_issue`, then report the created issue ID back to the user
6. When a test run relates to an existing issue, `add_issue_comment` with the verdict (pass/fail), the steps run, and the evidence — do not silently change the issue state
