---
description: "Generate comprehensive web app test cases with coverage matrix and risk analysis"
name: "Generate Test Cases"
argument-hint: "Paste spec, user story, or requirements; or reference a file"
agent: "test-analyst"
---
Generate comprehensive test cases for web application testing.

## Input
Provide one of the following:
- A product specification or feature description
- A user story with acceptance criteria
- A screenshot or flow diagram (describe it)
- A file path to existing requirements (e.g., `[spec.md](./spec.md)`)

## Output
I will produce:
1. **Scope & Assumptions** — what's in/out of scope, key assumptions
2. **Coverage Matrix** — requirement-to-test-case mapping
3. **Test Cases** — structured with ID, priority, preconditions, steps, expected results, type, automation readiness
4. **Risks & Gaps** — uncovered areas and follow-up questions

## Tips
- For detailed test cases, paste the full spec/requirement
- For quick test cases only, just ask "generate test cases for [feature]"
- Include existing test patterns or naming conventions to match style
