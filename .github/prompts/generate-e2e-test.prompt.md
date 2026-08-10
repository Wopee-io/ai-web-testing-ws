---
description: "Turn a user flow into a runnable Playwright spec, verified against the live app"
name: "Generate E2E Test"
argument-hint: "Describe the user flow, e.g. 'filter by Pizza, open Pizza Corner, add Margherita to cart'"
---
Generate a Playwright E2E test for the user flow described below.

## Rules

1. Target app: https://foodora.lovable.app/ (unless the flow names another URL)
2. First explore the flow live using the Playwright MCP browser tools - derive locators from the real accessibility tree, never guess them
3. Follow the conventions in `AGENTS.md`: `getByRole`/`getByLabel` locators, web-first assertions, no hard waits, kebab-case file name in `tests/`
4. Every step from the flow becomes a commented step in the spec; every expected outcome becomes an assertion
5. After writing the file, run it with `npx playwright test <file> --reporter=line` and fix failures until green

## Flow to test

${input}
