# AI Agents

Three approaches to building AI testing agents — from custom tools to zero-tool simplicity.

## Key Concepts

- **Planning & Reasoning** — agents break tasks into subgoals using chain-of-thought, then self-reflect and refine
- **Tools** — symbolic (click, fill, open browser), APIs (seed DB, get test data), neural (other LLMs for image analysis, test data generation)
- **Memory** — short-term (context window), long-term (RAG, fine-tuning, skills)

## Experiments

| #   | Experiment                                      | Approach                                   | Key Tech                            |
| --- | ----------------------------------------------- | ------------------------------------------ | ----------------------------------- |
| 4.1 | [Simple Testing Agent](./1-SimpleTestingAgent/) | Custom tools (click, fill, screenshot)     | Vercel AI SDK + Playwright Page API |
| 4.2 | [Wopee.io Agent](./2-WopeeAgent/)               | No-code platform with AI browser agent     | Wopee.io Commander                  |
| 4.3 | [GitHub Copilot Agent](./3-GitHubCopilotAgent/) | Zero custom tools — LLM calls CLI via bash | Copilot SDK + Playwright CLI        |

## Progression

- **4.1** — Build an agent from scratch: define tools, wire up the agent loop, understand how LLMs decide which tool to call
- **4.2** — Skip the code: use Wopee.io to crawl an app, generate test cases, and execute them with an AI agent
- **4.3** — Minimal code (~40 lines): let the LLM figure out browser automation by calling `playwright-cli` commands directly

## Two Execution Paths

```text
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│  Option 1: Copilot + MCP        │     │  Option 2: Wopee.io Commander   │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│                                 │     │                                 │
│  GitHub Copilot Agent           │     │  Wopee.io Commander             │
│  (MCP Client)                   │     │         │                       │
│      │            │             │     │   ┌─────┼─────┐                 │
│      ▼            ▼             │     │   ▼     ▼     ▼                 │
│  Playwright    Wopee.io         │     │  Analyze  Generate  Execute     │
│  MCP Server    MCP Server       │     │  (crawl)  (US/TC)   (agent)    │
│      │            │             │     │                                 │
│      ▼            ▼             │     │  Locator strategies:            │
│  Interaction   Assertion        │     │  Aria, HTML, Visual,            │
│  tools         tools            │     │  w/ self-healing                │
│                                 │     │                                 │
│  → Generate PRD                 │     │  → History & traceability       │
│  → Execute tests                │     │  → Playwright code export       │
│  → Analyze results              │     │  → CI/CD via API                │
└─────────────────────────────────┘     └─────────────────────────────────┘
```

## Future: AI Testing Teams

A single agent can orchestrate an entire testing team workflow:

1. **Fetch** bug details from Jira (Atlassian MCP)
2. **Find** relevant tests in Wopee.io (Wopee MCP)
3. **Select** top 3 tests and run them
4. **Execute** tests with Playwright MCP
5. **Report** results back to Jira as a comment

This is not hypothetical — it works today with MCP-connected agents (see experiment 6).

See each experiment's README for setup, prerequisites, and exercises.
