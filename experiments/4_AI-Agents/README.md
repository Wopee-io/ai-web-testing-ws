# AI Agents

Three approaches to building AI testing agents — from custom tools to zero-tool simplicity.

| #   | Experiment                                      | Approach                                   | Key Tech                            |
| --- | ----------------------------------------------- | ------------------------------------------ | ----------------------------------- |
| 4.1 | [Simple Testing Agent](./1-SimpleTestingAgent/) | Custom tools (click, fill, screenshot)     | Vercel AI SDK + Playwright Page API |
| 4.2 | [Wopee.io Agent](./2-WopeeAgent/)               | No-code platform with AI browser agent     | Wopee.io Commander                  |
| 4.3 | [GitHub Copilot Agent](./3-GitHubCopilotAgent/) | Zero custom tools — LLM calls CLI via bash | Copilot SDK + Playwright CLI        |

## Progression

- **4.1** — Build an agent from scratch: define tools, wire up the agent loop, understand how LLMs decide which tool to call
- **4.2** — Skip the code: use Wopee.io to crawl an app, generate test cases, and execute them with an AI agent
- **4.3** — Minimal code (~40 lines): let the LLM figure out browser automation by calling `playwright-cli` commands directly

See each experiment's README for setup, prerequisites, and exercises.
