# Experiment 4.3: GitHub Copilot Testing Agent

## Introduction

A minimal AI testing agent using **GitHub Copilot SDK** + **Playwright CLI**.

The agent reads test instructions from a config file and executes them autonomously — no custom tools needed. The LLM uses `playwright-cli` commands via shell to control the browser.

## Architecture

```text
config.ts  →  test instructions (what to test)
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

The Copilot SDK needs access to GitHub Copilot. You have two options:

### Option A: GitHub CLI (recommended)

If you have [GitHub CLI](https://cli.github.com/) installed and a Copilot subscription:

```bash
gh auth login
```

The SDK will automatically pick up your GitHub CLI credentials.

### Option B: Environment variable

Set a GitHub token with Copilot access:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

The SDK checks for tokens in this order: `COPILOT_GITHUB_TOKEN` → `GH_TOKEN` → `GITHUB_TOKEN` → GitHub CLI credentials.

### No Copilot subscription?

You can use your own API keys (BYOK) from OpenAI, Azure, or Anthropic — no Copilot subscription required. See [Copilot SDK BYOK docs](https://github.com/github/copilot-sdk/blob/main/docs/auth/index.md) for setup.

## Setup

```bash
npm install @github/copilot-sdk @playwright/cli tsx
```

## Run

```bash
npx tsx experiments/4_AI-Agents/3-GitHubCopilotAgent/run.ts
```

## Try It Yourself

1. **Login test** (default): Run as-is — agent tests login on saucedemo.com
2. **Purchase flow**: Uncomment the purchase test in `config.ts` and run
3. **Problem user**: Uncomment the problem_user test — observe bug detection
4. **Your app**: Change `baseUrl` and `testInstructions` to test your vibe-coded app
5. **3 test scenarios**: Write 3 different test instructions for your app
