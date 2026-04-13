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

### Introduction to MCP: Wopee.io, Playwright, GitHub, Jira

Participants will be introduced to the concept of MCP (Model Context Protocol) and how it enables LLMs to work directly with tools such as Wopee.io, Playwright, GitHub, or Jira. Through practical examples, they will see how an AI agent can run tests, read issues, create tickets, or analyze results. In exercises, they will try what these integrations can look like.

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

1. **Connect with me via LinkedIn:** [linkedin.com/in/marcel-veselka](https://www.linkedin.com/in/marcel-veselka) — share your expectations and questions, and I will adjust the workshop based on that.
2. **Submit this form:** [forms.gle/X8SD4mka4wgCPc6t9](https://forms.gle/X8SD4mka4wgCPc6t9) — we'll make sure we are ready for you.
3. **Install Node.js:** [nodejs.org/en/download](https://nodejs.org/en/download/)
4. **Set up VS Code and Playwright:** [playwright.dev/docs/getting-started-vscode](https://playwright.dev/docs/getting-started-vscode)
5. **Clone this repo:**
   - Windows: `Ctrl+Shift+P` → Git: Clone → paste this repository URL
   - Mac: `Cmd+Shift+P` → Git: Clone → paste this repository URL
6. **Install dependencies:** Open the terminal in VS Code and run `npm install` to install all necessary packages.
7. Create accounts for [GitHub](https://github.com) and [Wopee.io](https://wopee.io) using the same email address.
8. Create a new project in [Wopee.io](https://cmd.wopee.io) and create a new API key (Project > Project Settings > API Keys).
9. Copy .env.example to .env and fill in the values and set `WOPEE_API_KEY` and `WOPEE_PROJECT_UUID` with the values from your Wopee.io account.
10. **Run tests:** Run `npm test` to verify everything is set up correctly.
11. **Let me know you're ready** via LinkedIn chat, or ask any questions there.

> **Note:** Admin rights make it easier to install and access tools & resources (like AI APIs) we will use during the workshop.
