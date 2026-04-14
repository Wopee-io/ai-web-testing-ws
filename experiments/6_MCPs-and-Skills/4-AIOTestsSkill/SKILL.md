---
name: aio-tests
description: >
  Manage test cases in AIO Tests (JIRA TCMS plugin) via REST API. Use when
  fetching, creating, or updating test cases programmatically — e.g., bulk
  import from specs, create cases from Jira issues, or sync test definitions.
  Trigger on: AIO Tests, AIO API, TCMS, test case management, fetch test cases,
  create test case, update test case.
---

# AIO Tests Skill

Fetch, create, or update test cases in AIO Tests (JIRA TCMS plugin) using REST API via curl commands.

> **CRITICAL:** The API uses `title` for test case names, NOT `name`. Using `name` will fail with "Mandatory data is missing". This is the #1 error.

## API Reference

The complete API specification is available in [openapi.json](openapi.json). Refer to it for detailed endpoint definitions and request/response schemas.

## Output Rules

When the user does not specify output format:

1. **Fetch:** Return a markdown table with columns `ID`, `key`, `title`. Then print `Total fetched: N` and clarify whether it is full total or per-page total.
2. **Create:** Return: test case key (e.g., "KAN-TC-3"), title, status, version.
3. **Update:** Return: confirmation with the key and updated fields.

## Context and Constraints

- Environment variables are in `.env` — fetch the token from `.env`, use it in curl commands, but **never echo or print the token** in your response to the user.
  - `AIO_ACCESS_TOKEN`
  - `JIRA_PROJECT_ID_OR_KEY`
- Use exact paths and schemas from the OpenAPI spec.
- For simple fields: use basic types (string, number).
- For complex fields (`status`, `priority`, `folder`): use object structures as defined in the OpenAPI schema.

## How to Fetch Tests

```bash
AIO_ACCESS_TOKEN="YOUR_AIO_API_TOKEN"
JIRA_PROJECT_ID_OR_KEY="JIRA_PROJECT_ID_OR_KEY"

curl -i -sS \
 -H "Accept: application/json" \
 -H "Authorization: AioAuth ${AIO_ACCESS_TOKEN}" \
  "https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/${JIRA_PROJECT_ID_OR_KEY}/testcase?startAt=0&maxResults=100&needDataInRTF=false"
```

### Endpoint

- `GET /api/v1/project/{jiraProjectId}/testcase`

### Query Params

- `startAt` — default `0`
- `maxResults` — default `100` (values < 10 or > 100 are clamped to 100)
- `needDataInRTF` — optional boolean (default false recommended for smaller payloads)

## How to Create Tests

```bash
curl -X POST \
 -H "Content-Type: application/json" \
 -H "Accept: application/json" \
 -H "Authorization: AioAuth ${AIO_ACCESS_TOKEN}" \
  -d '{"title":"Add 4 products into shopping cart"}' \
  "https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/${JIRA_PROJECT_ID_OR_KEY}/testcase"
```

### Endpoint

- `POST /api/v1/project/{jiraProjectId}/testcase`

### Request Body (JSON)

- `title` (required) — the test case name
- `description` (optional) — description or objective (RTF field)
- `precondition` (optional) — preconditions (RTF field)
- `priority` (optional) — priority object (NOT a simple string)
- `status` (optional) — status object (NOT a simple string), defaults to "Draft"
- `folder` (optional) — folder object
- `steps` (optional) — array of test steps

A quick case only needs `title`. No other field is mandatory.

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Mandatory data is missing. Please provide value for Title." | Used `name` instead of `title` | Use `"title": "..."` |
| "Cannot construct instance of PublicTestStatusTo" | Passed status as string | Use object structure from OpenAPI schema |
| Similar to above for priority | Passed priority as string | Use object structure from OpenAPI schema |

## How to Update Tests

```bash
curl -i -sS -X PUT \
 -H "Content-Type: application/json" \
 -H "Accept: application/json" \
 -H "Authorization: AioAuth ${AIO_ACCESS_TOKEN}" \
  -d '{"title": "Updated title", "description": "Updated description"}' \
  "https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/${JIRA_PROJECT_ID_OR_KEY}/testcase/${TEST_CASE_ID}/detail"
```

### Endpoint

- `PUT /api/v1/project/{jiraProjectId}/testcase/{testCaseId}/detail`

Only include the fields you want to update. Unspecified fields retain their current values.

## Best Practices

1. For quick test creation — use only the `title` field
2. For field names — verify against the OpenAPI schema (`CaseFullDetails` object)
3. For complex updates — update simple fields first, then complex objects separately
4. If you get field-related errors — check the OpenAPI schema for the exact structure
