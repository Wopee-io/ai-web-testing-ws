# LLM Basics: Hands-On Experiments

Four short experiments that build intuition for how LLMs behave as testing assistants - how model choice affects output quality, how randomness works, where context limits bite, and what vision models can (and can't) see.

## Key Concepts

- **Model quality** - bigger isn't always better; judge models by output, not by brand
- **Temperature** - the randomness dial: deterministic photocopier at 0.0, wild brainstormer at 1.5
- **Context window** - the model's working memory; exceed it and quality degrades quietly
- **Multimodality** - vision models read screenshots, not just text and code

## Experiments

| #   | Experiment                                       | What you'll learn                           | Where                                                        |
| --- | ------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| 1.1 | [Blind Model Battle](./1-ModelBattle/)           | Judging model quality without brand bias    | [arena.ai](https://arena.ai/)                                |
| 1.2 | [Temperature Dial](./2-TemperatureDial/)         | How randomness affects test idea generation | [Vercel AI SDK Playground](https://ai-sdk.dev/playground)    |
| 1.3 | [Context Window Stress Test](./3-ContextWindow/) | What happens when input outgrows the model  | [Vercel AI SDK Playground](https://ai-sdk.dev/playground)    |
| 1.4 | [Vision Bonus](./4-VisionBonus/) *(optional)*    | Generating test scenarios from a screenshot | [HuggingFace Playground](https://huggingface.co/playground)  |

## Progression

- **1.1** - Start with zero setup: upload a screenshot, get UAT test cases from two anonymous models, vote for the better one
- **1.2** - Take control of the randomness dial: same prompt, nine runs, three temperatures
- **1.3** - Hit the context ceiling on purpose: small HTML vs. full page source
- **1.4** - (Optional) Let a vision model design test scenarios straight from a screenshot

## Models (Experiments 1.2 & 1.3)

We will use two models side by side for comparison:

|                    | Qwen3-14B      | Gemma 4 26B A4B IT |
| ------------------ | -------------- | ------------------ |
| **Provider**       | DeepInfra      | Novita AI          |
| **Context**        | 40,960 tokens  | 262,144 tokens     |
| **Input Pricing**  | $0.12 / 1M tok | $0.13 / 1M tok     |
| **Output Pricing** | $0.24 / 1M tok | $0.40 / 1M tok     |

Both are available in the Vercel AI SDK Playground. Run Experiments 1.2 and 1.3 with **both models** and compare the results.

## Quick Evaluation Template

Fill this in after completing Experiments 1.2 and 1.3:

| Criteria                     | Qwen3-14B | Gemma 4 26B |
| ---------------------------- | --------- | ----------- |
| Test case quality (1–5)      |           |             |
| Hallucinated elements?       |           |             |
| Best temperature for testing |           |             |
| Context window handling      |           |             |
| Would you use in CI/CD?      |           |             |
| Response speed               |           |             |

---

See each experiment's README for step-by-step instructions and discussion points.
