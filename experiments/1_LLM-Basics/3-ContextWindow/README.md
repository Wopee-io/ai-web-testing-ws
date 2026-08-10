# Experiment 1.3: Context Window Stress Test

> **Time:** ~10 min

## The Concept

Every model has a context ceiling - the maximum amount of text it can "see" at once. Feed it more than it can handle and quality degrades quietly: missed elements, hallucinated selectors, truncated output. This experiment makes that ceiling visible.

## Settings

Use **both models** from the [overview](../README.md#models-experiments-12--13) in the [Vercel AI SDK Playground](https://ai-sdk.dev/playground) with the same settings:

- Temperature: **0.0** (we want deterministic output to compare quality, not randomness)
- Top P: **0.9**
- Max Output Tokens: **1024**

## Step 1 - Short HTML (~80 lines, just the login form)

Open [`files/small.html`](files/small.html) and copy-paste its content into the playground with this prompt:

> *Analyze this HTML and generate a Playwright test in TypeScript that tests form validation - empty fields, invalid credentials, and successful login.*

## Step 2 - Full page source (~270 lines)

Open [`files/big.html`](files/big.html) and copy-paste its content. Use the **same prompt**.

## What to Observe

| Question                                       | Qwen3-14B (41K ctx) | Gemma 4 26B (262K ctx) |
| ---------------------------------------------- | -------------------- | ---------------------- |
| Did it find all form elements?                 |                      |                        |
| Did quality drop with the full page?           |                      |                        |
| Any hallucinated selectors (don't exist in HTML)? |                   |                        |
| Did it handle the extra context or get confused? |                    |                        |

> 💡 **Key insight:** Qwen3-14B has only ~41K tokens of context vs Gemma 4's ~262K. If you notice Qwen truncating, degrading, or missing elements on the full page source - that's the point. You're hitting the context ceiling. This is why context window size matters for real-world test generation from large codebases.
