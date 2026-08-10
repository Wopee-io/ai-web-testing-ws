# Gen AI pro Web UI Testing

An intensive one-day workshop exploring practical applications of generative AI in web application testing, focusing on automating test creation and improving QA team efficiency.

- **Instructor:** [Marcel Veselka](https://www.linkedin.com/in/marcelveselka/) (Founder of [Wopee.io](https://wopee.io) and [Tesena](https://www.tesena.com))
- **More info:** [tesena.com/en/gen-ai-pro-web-ui-testing](https://www.tesena.com/en/gen-ai-pro-web-ui-testing/a-927/)

## Target audience

Test analysts, manual testers, test automation engineers, QA leads, and developers seeking to systematically incorporate GenAI and LLM technologies into their web application testing practices.

## Workshop content

### Introduction

A brief introduction to GenAI in testing and an overview of the main goals of the workshop. Participants will gain a high-level understanding of where GenAI makes sense in testing today and where its limits are. We will align expectations and define the concrete outcomes participants should take away from the workshop.

### LLM models – basic overview

We will explain what LLM models are, how they work, and why they are relevant for testing. We will go through the differences between various types of models and ways to deploy them in practice.

### Vibe coding (examples with Lovable)

We will demonstrate the concept of "vibe coding" — rapid creation of functionality and prototypes using LLM-based tools such as Lovable.dev. Participants will see how simple applications can be generated. In the practical part, they will try how an application can be created from a testing assignment.

### LLM workflows (examples with Playwright AI bot)

We will show how to compose workflows from individual LLM calls that genuinely help testing teams. Using examples with the playwright-ai-bot tool, we will demonstrate test generation from user scenarios, screenshots, or an existing application.

### AI agents (planning and reasoning, tools, memory)

We will explain the difference between a simple LLM call and a real AI agent that plans, uses tools, and works with memory. We will go through concrete testing scenarios where agents can take over part of the tester's work, such as exploratory testing or building regression suites. In the practical part, participants will try how to use such an agent in a testing context.

### AI-augmented testing – opportunities

We will look at how to gradually integrate GenAI into existing testing processes without a "big bang" change. We will show where to start with quick wins — from generating test scenarios and planning tests, through review and maintenance, to generating test reports.

### Introduction to MCP: Wopee.io, Playwright, GitHub, Jira, YouTrack

Participants will be introduced to the concept of MCP (Model Context Protocol) and how it enables LLMs to work directly with tools such as Wopee.io, Playwright, GitHub, Jira, or YouTrack. Through practical examples, they will see how an AI agent can run tests, read issues, create tickets, or analyze results. In exercises, they will try what these integrations can look like.

### The future of (AI?) testing

Finally, we will look at trends in AI and the future of testing. We will discuss how the tester's role may change and which skills will become critical. We will open a discussion about what specifically makes sense to introduce in your team in the near future.

## Training format

- Theory and presentation (slides)
- Practical exercises with active participant involvement

The theoretical blocks are always complemented by concrete real-world examples. Practical exercises are carried out directly on web UI automation examples, using tools such as GitHub Copilot, Atlassian (JIRA and Confluence), Wopee.io, and Playwright.

In-house training (minimum 8 participants) can be tailored to specific team environments, with optional extensions covering API testing.

## What to bring

- Laptop with admin rights (let me know if you can't have admin rights)
- Browser (preferably Chrome)
- Accounts for [GitHub](https://github.com) and [Wopee.io](https://wopee.io) — use the same email for both
- [VS Code](https://code.visualstudio.com/) with [GitHub Copilot](https://github.com/features/copilot) (free plan is enough)

## Get ready for the workshop

Please follow these steps before the workshop:

1. **Connect with me via LinkedIn:** [linkedin.com/in/marcelveselka](https://www.linkedin.com/in/marcelveselka) — share your expectations and questions, and I will adjust the workshop based on that.
2. **Submit this form:** [Google Form](https://forms.gle/8C4o9JTEmqUgSqoE6) — we'll make sure we are ready for you.
3. **Install the tools:** [Node.js LTS](https://nodejs.org/en/download/), [Git](https://git-scm.com/downloads), and the [GitHub CLI](https://cli.github.com/) — then sign in with `gh auth login`. Windows users: see the [Windows notes](#windows-notes) below.
4. **Set up VS Code and Playwright:** [playwright.dev/docs/getting-started-vscode](https://playwright.dev/docs/getting-started-vscode)
5. **Clone this repo:** in VS Code, `Ctrl/Cmd+Shift+P` → Git: Clone → paste this repository URL, then run `npm install` in the VS Code terminal.
6. **Set up Wopee.io:** create accounts for [GitHub](https://github.com) and [Wopee.io](https://wopee.io) (same email), create a project in [cmd.wopee.io](https://cmd.wopee.io) with an API key (Project > Project Settings > API Keys), then copy `.env.example` to `.env` and fill in `WOPEE_API_KEY` and `WOPEE_PROJECT_UUID`.
7. **Verify:** run `npm test` — you should see `workshop setup check: Foodora homepage loads ... 1 passed`. Anything else: [setup troubleshooting](./docs/setup-troubleshooting.md).
8. **Let me know you're ready** via LinkedIn chat, or ask any questions there.

### Optional extras

Not required for the workshop — set up any time if you want them:

- **YouTrack MCP** — the repo's MCP configs are preconfigured for `https://wopee.youtrack.cloud/mcp`; create a permanent token and add it to `.env`. Full steps (and using your own instance): [experiment 6.6](./experiments/6_MCPs-and-Skills/6-YouTrackMCP/)
- **Claude Code** — prefer it over GitHub Copilot? The repo ships a project-scoped MCP config with the same servers; start with `npm run claude:mcp`. Full instructions: [docs/claude-code-mcp.md](./docs/claude-code-mcp.md)

### Windows notes

Two things Windows attendees hit every time (details and fixes in [setup troubleshooting](./docs/setup-troubleshooting.md)):

- **Git is not preinstalled** — `winget install --id Git.Git -e --source winget`, then reopen the terminal.
- **PowerShell blocks npm** ("npm.ps1 cannot be loaded...") — `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, no admin needed.

> **Note:** Admin rights make it easier to install and access tools & resources (like AI APIs) we will use during the workshop.
