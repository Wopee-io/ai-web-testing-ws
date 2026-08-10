# Agent Instructions

Shared rules for all AI coding agents working in this repo (GitHub Copilot, Claude Code, Cursor, OpenCode). This file is the single source of truth; tool-specific files only point here.

## What this repo is

AI web testing workshop (2026) by Wopee.io. Hands-on experiments live under `experiments/`, numbered 0-7. The system under test for exercises is the demo food-delivery app **https://foodora.lovable.app/** (restaurant cards, category filters, search, cart, `/auth` sign-in).

## Stack

- TypeScript, Node.js 20+
- Playwright (`@playwright/test`) - config in `playwright.config.ts`, tests in `tests/`
- MCP servers preconfigured in `.vscode/mcp.json` (Playwright, Wopee.io, Atlassian, YouTrack)

## Test conventions

- Locators: prefer `getByRole` / `getByLabel` / `getByText`; avoid CSS/XPath selectors tied to markup structure
- No hard waits (`waitForTimeout`) and never `networkidle`; rely on web-first assertions (`toBeVisible`, `toHaveText`, ...)
- One test file per flow, kebab-case names: `checkout-happy-path.spec.ts`
- Run tests with `npx playwright test --reporter=line` (headless); experiment-specific scripts: `npm run e4.1`, `npm run e4.3`

## Boundaries

- Never commit `.env` or any credentials; `.env.example` documents the expected variables
- Do not modify files under `experiments/*/files/` (workshop fixtures)
- Keep experiment READMEs' numbering scheme intact (folders `N_Name`, experiments `N.M`)
