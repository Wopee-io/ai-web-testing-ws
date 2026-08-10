# Experiment 1.2: Temperature Dial - "How Creative Should the Machine Be?"

> **Time:** ~15–20 min (9 runs + group discussion)

## The Concept

Temperature controls randomness. At **0.0**, the model always picks the most probable next word - like a careful employee following a script. At **1.5**, it rolls the dice among many plausible words - like a brainstorming session after two coffees.

Run this experiment in the [Vercel AI SDK Playground](https://ai-sdk.dev/playground) with **both models** from the [overview](../README.md#models-experiments-12--13) and compare the results.

## Important: Settings

Set these in the Vercel AI SDK Playground settings panel **before you start** and keep them constant across all runs:

| Parameter         | Value   | Why                                              |
| ----------------- | ------- | ------------------------------------------------ |
| **Top P**         | **0.9** | Constrains token selection so temperature can work |
| **Max Output Tokens** | 1024 | Keeps responses comparable                      |
| **Frequency Penalty** | 0   | No extra penalty - isolate temperature only      |
| **Presence Penalty**  | 0   | No extra penalty - isolate temperature only      |

> ⚠️ **Do NOT leave Top P at 1.0** - it overrides the temperature effect and you'll get identical outputs at every temperature. This is the most common mistake.

## The Prompt

Use this **exact prompt** every time - do not change a single word between runs:

> *You are a creative QA engineer exploring edge cases. Suggest 5 unusual or unexpected test scenarios for the login form of a food delivery website (email field, password field, Login button). Think beyond the obvious - what would surprise a developer?*

## Round 1 - Temperature 0.0 (the "Photocopier") 📋

1. Set **Temperature = 0.0**
2. Run the prompt **3 times**
3. Paste each output into the shared doc as **Run 1A, 1B, 1C**

**What you'll see:** The three outputs are nearly identical - same scenarios, same wording, same order. The model is deterministic. It's a photocopier.

## Round 2 - Temperature 0.7 (the "Reliable Colleague") 🤝

1. Set **Temperature = 0.7**
2. Run the prompt **3 times**
3. Paste as **Run 2A, 2B, 2C**

**What you'll see:** The core ideas are similar, but the wording shifts. Maybe "Test login with SQL injection in email field" becomes "Attempt authentication with malicious input containing SQL commands." Same intent, different phrasing - and occasionally a new idea sneaks in.

## Round 3 - Temperature 1.5 (the "Wild Brainstormer") 🎲

1. Set **Temperature = 1.5**
2. Run the prompt **3 times**
3. Paste as **Run 3A, 3B, 3C**

**What you'll see:** Each run produces noticeably different ideas. You might get creative edge cases (emoji in email, 10,000-character password, login during timezone change) - but also some that don't quite make sense or are hard to follow.

## Comparison Table (fill in as you go)

Copy this table and fill it in for **each model separately**:

**Model: \_\_\_\_\_\_\_\_\_\_\_\_\_\_**

|              | Run A (scenario titles) | Run B (scenario titles) | Run C (scenario titles) | Identical across runs? |
| ------------ | ----------------------- | ----------------------- | ----------------------- | ---------------------- |
| **Temp 0.0** |                         |                         |                         | Yes / No               |
| **Temp 0.7** |                         |                         |                         | Yes / No               |
| **Temp 1.5** |                         |                         |                         | Yes / No               |

## Scoring (group discussion, ~5 min)

Count across all 9 runs per model:

| Metric                                 | Temp 0.0 | Temp 0.7 | Temp 1.5 |
| -------------------------------------- | -------- | -------- | -------- |
| **Unique test ideas** (deduplicated)   | ___ / 15 | ___ / 15 | ___ / 15 |
| **Usable in a real test plan**         | ___ / 15 | ___ / 15 | ___ / 15 |
| **Hallucinated / nonsense**            | ___ / 15 | ___ / 15 | ___ / 15 |

## The Takeaway

| Temperature | Personality           | Use when...                                                    |
| ----------- | --------------------- | -------------------------------------------------------------- |
| **0.0**     | 📋 Photocopier        | CI/CD pipelines, automated workflows - you need **repeatable, predictable** output every time |
| **0.7**     | 🤝 Reliable colleague | **Test case brainstorming** - enough variety to surface edge cases, reliable enough to stay useful |
| **1.5**     | 🎲 Wild brainstormer  | **Creativity booster** when you're stuck - expect to throw away ~30–50% of the output |
