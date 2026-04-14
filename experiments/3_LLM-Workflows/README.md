# LLM Workflows

> This section is covered in slides — no hands-on experiments.

## Topics Covered

- **LLM application architectures** — augmented LLM, prompt chaining, routing, parallelization, evaluator-optimizer, autonomous agents (source: [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents))
- **Test script creation process** — URLs/HTML/screenshots → user stories → test cases → executable code, with LLM workflows and human review at each step
- **Test generation from scenarios** — turning user stories and acceptance criteria into test cases with an LLM
- **Test generation from screenshots** — using vision models to derive tests from UI screenshots
- **Playwright AI Bot** — automated test generation using LLM-powered browser interaction

Resources:

- https://wopee.io/blog/playwright-bot-ai-powered-test-automation/
- https://github.com/Wopee-io/playwright-ai-bot-demo

## Try It Yourself

1. Open Claude or ChatGPT and paste the spec from `experiments/2_Vibe-Coding/spec-sample.md` — ask it to generate Playwright test cases
2. Take a screenshot of https://foodora.lovable.app and upload it to a vision model — ask it to identify testable interactions and generate test scenarios
3. Clone the [playwright-ai-bot demo](https://github.com/Wopee-io/playwright-ai-bot-demo) and try generating tests for your vibe-coded app
