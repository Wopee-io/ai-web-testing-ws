# Experiment 4.1: Simple AI Testing Agent

## Introduction

We will be coding together in this section. All work happens in `experiments/4_AI-Agents/1-SimpleTestingAgent/`.

1. Explore the folder structure
2. Set your `.env` file with your Azure OpenAI credentials (see `.env.example`)
3. Explore `run-agent.spec.ts` and `agent.ts`
4. Review config file: `config.ts`
5. Run tests: `npm run e4`

For more info about agents see: [Vercel AI SDK - Agents](https://sdk.vercel.ai/docs/foundations/agents)

## Try It Yourself

1. Run simple `login test`: config.ts → `userPrompt` → check if it is correct → run test → check results
2. Change prompt in `config.ts` to run entire `checkout process` (prompt is already prepared) → run test → check results
3. Prepare new prompt (just comment out existing prompt) and run test for `ordering by price`. _Note: New tool `select` is needed to select product ordering option._
4. Adjust prompt to test with other users (`locked_out_user`, `problem_user`, `performance_glitch_user`). Also try to provide other passwords for users.
5. Modify the agent to test your vibe-coded app
6. Prepare 3 relevant tests for your vibe-coded app and execute them with the agent
