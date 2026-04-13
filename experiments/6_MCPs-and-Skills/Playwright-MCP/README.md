# Experiment # 6: Playwright MCP

## Setup

1. Install [Playwright MCP](https://github.com/microsoft/playwright-mcp) server

First, install the Playwright MCP server.

One-click installation:

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Playwright_MCP-0098FF?style=flat-square&logo=visualstudiocode&logoColor=ffffff)](vscode:mcp/install?%7B%22name%22%3A%22playwright%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40playwright%2Fmcp%40latest%22%5D%7D)

**Standard config** works in most of the tools:

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

2. Open VS Code Chat (Windows / Linux: `Ctrl + Shift + I`, macOS: `⌘ Command + Shift + I`)

3. Copy & paste the tests from `first-prompt.md` to VS Code Chat (make sure Agent mode is enabled).

4. Copy & paste the tests from `first-test.md` to VS Code Chat (make sure Agent mode is enabled).

- Experiment, debug and make it work.
- Change the prompt
- Change models agent is using

6. Copy & paste the tests from `more-tests.md` to VS Code Chat.

7. **Challenge:** Add 10 more tests for each app.

8. Discuss opportunities and limitations of the approach.