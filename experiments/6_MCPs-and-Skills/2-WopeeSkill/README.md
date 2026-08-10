# Experiment 6.2: Wopee.io Skill

A custom Claude skill (`wopee-fooddash-testing`) that teaches an AI agent to run the full Wopee.io testing lifecycle for the FoodDash demo app ([foodora.lovable.app](https://foodora.lovable.app/)): crawl the app, generate user stories and test cases, execute them with an AI browser agent, and review results.

We evaluated the skill against an unguided baseline (same model, same MCP tools, same prompts, 6 scenarios, 27 graded assertions): **93% vs 67% pass rate (+26 pts), 2x faster, -15% tokens**.

## Files

| File | What it is |
| --- | --- |
| [SKILL.md](./SKILL.md) | The skill itself: tool reference, workflows, guardrails |
| [EVAL_REPORT.md](./EVAL_REPORT.md) | Full evaluation write-up: scenarios, results, takeaways |
| [index.html](./index.html) | The report as a shareable web page |
| [infographic-1-metrics.html](./infographic-1-metrics.html) | Metrics infographic |
| [infographic-2-methodology.html](./infographic-2-methodology.html) | Methodology and comparison infographic |
| [benchmark.json](./benchmark.json) | Raw run data (timings, tokens, tool calls) |
| [evals.json](./evals.json) | Assertion definitions used for grading |

## Learn more

- [Skills overview in the section README](../README.md)
- [agentskills.io](https://agentskills.io) - the open skill format
