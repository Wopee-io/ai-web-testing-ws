# Experiment 4.3: GitHub Copilot Testing Agent

## Introduction

A minimal AI testing agent using **GitHub Copilot SDK** + **Playwright CLI**.

The agent reads test instructions from a config file and executes them autonomously — no custom tools needed. The LLM uses `playwright-cli` commands via shell to control the browser.

## Architecture

```text
config.ts  →  test instructions (what to test)
auth.ts    →  auth token resolution + env preparation
agent.ts   →  Copilot SDK session + system prompt (~40 lines)
run.ts     →  entry point
```

**How it works:**

1. Agent receives your test instructions
2. LLM decides which `playwright-cli` commands to run
3. Built-in `bash` tool executes the commands
4. LLM reads the output, decides next step
5. Repeat until test is complete

## Playwright CLI vs MCP

Same Playwright engine, same team — different interface for the LLM:

|                     | **CLI** (`@playwright/cli`)            | **MCP** (`@playwright/mcp`)                 |
| ------------------- | -------------------------------------- | ------------------------------------------- |
| **Transport**       | Daemon + shell commands                | JSON-RPC server                             |
| **Context cost**    | ~27K tokens/session                    | ~114K tokens/session                        |
| **Interactions**    | 50+ stable interactions                | ~15 before degradation                      |
| **Cost**            | 4x cheaper                             | Richer reasoning                            |
| **Context loading** | SKILLS system (progressive)            | Full accessibility tree                     |
| **Observability**   | Live dashboard (`playwright-cli show`) | Client-dependent                            |
| **Best for**        | Agents with shell access               | Sandboxed environments, exploratory testing |

> Use both: CLI as primary (agents with shell), MCP as fallback (sandboxed UIs).

## Authentication

This experiment supports **all authentication inputs implemented in `auth.ts`**.

### Resolution order (exact)

Token is resolved in this order:

1. `gh auth token -h github.com`
2. `GH_TOKEN`
3. `GITHUB_TOKEN`
4. `COPILOT_GITHUB_TOKEN`
5. `GITHUB_PAT`

If none are available, the run fails with a clear missing-token error.

### Option A: GitHub CLI login (recommended)

If you have [GitHub CLI](https://cli.github.com/) installed and a Copilot subscription:

```bash
gh auth login
```

After login, you can just run:

```bash
npm run e4.3
```

No manual export is needed because this project reads from `gh auth token` first.

### Option B: `.env` file (repository root)

`run.ts` loads `.env` automatically via `dotenv`.

Example `.env`:

```bash
GH_TOKEN=ghp_your_token_here
# or GITHUB_TOKEN=ghp_your_token_here
# or COPILOT_GITHUB_TOKEN=ghp_your_token_here
# or GITHUB_PAT=ghp_your_token_here
```

> If `gh auth token` is available, it takes precedence over `.env` values.

### Option C: Shell environment variable (local session)

#### macOS/Linux (bash/zsh)

```bash
export GH_TOKEN=ghp_your_token_here
npm run e4.3
```

#### Windows PowerShell

```powershell
$env:GH_TOKEN="ghp_your_token_here"
npm run e4.3
```

#### Windows CMD

```bat
set GH_TOKEN=ghp_your_token_here
npm run e4.3
```

### Option D: CI/CD secret environment variable

In CI, set one of these secret env vars (recommended: `GH_TOKEN` or `GITHUB_TOKEN`) and run:

```bash
npm run e4.3
```

---

### About BYOK / custom providers

Copilot SDK supports BYOK/custom providers, but **this experiment currently enforces GitHub token-based auth in `auth.ts`**.

If you want, we can add a BYOK mode switch so it can run without GitHub token when provider env vars are set.

## Setup

```bash
npm install @github/copilot-sdk @playwright/cli tsx
```

## Run

```bash
npm run e4.3
```

## Try It Yourself

1. **Login test** (default): Run as-is — agent tests login on saucedemo.com
2. **Purchase flow**: Uncomment the purchase test in `config.ts` and run
3. **Problem user**: Uncomment the problem_user test — observe bug detection
4. **Your app**: Change `baseUrl` and `testInstructions` to test your vibe-coded app
5. **3 test scenarios**: Write 3 different test instructions for your app
