# GitHub Copilot Instructions

Core rules live in [AGENTS.md](../AGENTS.md) at the repo root - read and follow them.

Copilot-specific notes:

- Reusable prompts are available in chat: `/test-cases` (test analysis via the Test Analyst agent) and `/generate-e2e-test` (user flow -> Playwright spec)
- A custom agent **Test Analyst** is defined in `.github/agents/test-analyst.agent.md` for test design tasks
- The Playwright MCP server is preconfigured in `.vscode/mcp.json` - use it in Agent mode to explore https://foodora.lovable.app/ before writing specs
- Prefer Agent mode for test generation and Plan mode before multi-file changes
