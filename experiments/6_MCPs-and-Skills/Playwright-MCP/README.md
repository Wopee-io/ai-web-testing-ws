# Experiment 6.1: Playwright MCP

## Setup

1. Install [Playwright MCP](https://github.com/microsoft/playwright-mcp) server

One-click installation:

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Playwright_MCP-0098FF?style=flat-square&logo=visualstudiocode&logoColor=ffffff)](vscode:mcp/install?%7B%22name%22%3A%22playwright%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40playwright%2Fmcp%40latest%22%5D%7D)

**Standard config** works in most tools:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

2. Open VS Code Chat (Windows / Linux: `Ctrl + Shift + I`, macOS: `Cmd + Shift + I`)

## Try It Yourself

1. Copy & paste the prompt from `1.prompt.md` to VS Code Chat (make sure Agent mode is enabled)
2. Copy & paste the tests from `2.prompt.md` to VS Code Chat
3. Experiment, debug, and make it work — try changing the prompt or switching models
4. Copy & paste the tests from `more.prompt.md` to VS Code Chat
5. **Challenge:** Add 10 more tests for each app
6. Discuss opportunities and limitations of the approach
