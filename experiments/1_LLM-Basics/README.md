# LLM Basics: Hands-On Experiments

## Setup

Navigate to [ai-sdk.dev/playground](https://ai-sdk.dev/playground)

Alternatively, you can use [huggingface.co/playground](https://huggingface.co/playground)

---

## Models

We will use two models side by side for comparison:

|                      | Qwen3-14B       | Gemma 4 26B A4B IT |
| -------------------- | --------------- | ------------------- |
| **Provider**         | DeepInfra       | Novita AI           |
| **Context**          | 40,960 tokens   | 262,144 tokens      |
| **Input Pricing**    | $0.12 / 1M tok  | $0.13 / 1M tok      |
| **Output Pricing**   | $0.24 / 1M tok  | $0.40 / 1M tok      |

Both are available in the Vercel AI SDK Playground. Run each experiment with **both models** and compare the results.

---

## Experiment A: Temperature Dial - "How Creative Should the Machine Be?"

> **Time:** ~15–20 min (9 runs + group discussion)

### The Concept (1 min)

Temperature controls randomness. At **0.0**, the model always picks the most probable next word — like a careful employee following a script. At **1.5**, it rolls the dice among many plausible words — like a brainstorming session after two coffees.

### Important: Settings

Set these in the Vercel AI SDK Playground settings panel **before you start** and keep them constant across all runs:

| Parameter         | Value   | Why                                              |
| ----------------- | ------- | ------------------------------------------------ |
| **Top P**         | **0.9** | Constrains token selection so temperature can work |
| **Max Output Tokens** | 1024 | Keeps responses comparable                      |
| **Frequency Penalty** | 0   | No extra penalty — isolate temperature only      |
| **Presence Penalty**  | 0   | No extra penalty — isolate temperature only      |

> ⚠️ **Do NOT leave Top P at 1.0** — it overrides the temperature effect and you'll get identical outputs at every temperature. This is the most common mistake.

### The Prompt

Use this **exact prompt** every time — do not change a single word between runs:

> *You are a creative QA engineer exploring edge cases. Suggest 5 unusual or unexpected test scenarios for the login form of a food delivery website (email field, password field, Login button). Think beyond the obvious — what would surprise a developer?*

### Round 1 — Temperature 0.0 (the "Photocopier") 📋

1. Set **Temperature = 0.0**
2. Run the prompt **3 times**
3. Paste each output into the shared doc as **Run 1A, 1B, 1C**

**What you'll see:** The three outputs are nearly identical — same scenarios, same wording, same order. The model is deterministic. It's a photocopier.

### Round 2 — Temperature 0.7 (the "Reliable Colleague") 🤝

1. Set **Temperature = 0.7**
2. Run the prompt **3 times**
3. Paste as **Run 2A, 2B, 2C**

**What you'll see:** The core ideas are similar, but the wording shifts. Maybe "Test login with SQL injection in email field" becomes "Attempt authentication with malicious input containing SQL commands." Same intent, different phrasing — and occasionally a new idea sneaks in.

### Round 3 — Temperature 1.5 (the "Wild Brainstormer") 🎲

1. Set **Temperature = 1.5**
2. Run the prompt **3 times**
3. Paste as **Run 3A, 3B, 3C**

**What you'll see:** Each run produces noticeably different ideas. You might get creative edge cases (emoji in email, 10,000-character password, login during timezone change) — but also some that don't quite make sense or are hard to follow.

### Comparison Table (fill in as you go)

Copy this table and fill it in for **each model separately**:

**Model: \_\_\_\_\_\_\_\_\_\_\_\_\_\_**

|              | Run A (scenario titles) | Run B (scenario titles) | Run C (scenario titles) | Identical across runs? |
| ------------ | ----------------------- | ----------------------- | ----------------------- | ---------------------- |
| **Temp 0.0** |                         |                         |                         | Yes / No               |
| **Temp 0.7** |                         |                         |                         | Yes / No               |
| **Temp 1.5** |                         |                         |                         | Yes / No               |

### Scoring (group discussion, ~5 min)

Count across all 9 runs per model:

| Metric                                 | Temp 0.0 | Temp 0.7 | Temp 1.5 |
| -------------------------------------- | -------- | -------- | -------- |
| **Unique test ideas** (deduplicated)   | ___ / 15 | ___ / 15 | ___ / 15 |
| **Usable in a real test plan**         | ___ / 15 | ___ / 15 | ___ / 15 |
| **Hallucinated / nonsense**            | ___ / 15 | ___ / 15 | ___ / 15 |

### The Takeaway

| Temperature | Personality           | Use when...                                                    |
| ----------- | --------------------- | -------------------------------------------------------------- |
| **0.0**     | 📋 Photocopier        | CI/CD pipelines, automated workflows — you need **repeatable, predictable** output every time |
| **0.7**     | 🤝 Reliable colleague | **Test case brainstorming** — enough variety to surface edge cases, reliable enough to stay useful |
| **1.5**     | 🎲 Wild brainstormer  | **Creativity booster** when you're stuck — expect to throw away ~30–50% of the output |

---

## Experiment B: Context Window Stress Test

> **Time:** ~10 min

### Setup

Use **both models** (Qwen3-14B and Gemma 4 26B A4B IT) with the same settings:
- Temperature: **0.0** (we want deterministic output to compare quality, not randomness)
- Top P: **0.9**
- Max Output Tokens: **1024**

### Step 1 — Short HTML (~80 lines, just the login form)

Open [`files/small.html`](files/small.html) and copy-paste its content into the playground with this prompt:

> *Analyze this HTML and generate a Playwright test in TypeScript that tests form validation — empty fields, invalid credentials, and successful login.*

### Step 2 — Full page source (~270 lines)

Open [`files/big.html`](files/big.html) and copy-paste its content. Use the **same prompt**.

### What to Observe

| Question                                       | Qwen3-14B (41K ctx) | Gemma 4 26B (262K ctx) |
| ---------------------------------------------- | -------------------- | ---------------------- |
| Did it find all form elements?                 |                      |                        |
| Did quality drop with the full page?           |                      |                        |
| Any hallucinated selectors (don't exist in HTML)? |                   |                        |
| Did it handle the extra context or get confused? |                    |                        |

> 💡 **Key insight:** Qwen3-14B has only ~41K tokens of context vs Gemma 4's ~262K. If you notice Qwen truncating, degrading, or missing elements on the full page source — that's the point. You're hitting the context ceiling. This is why context window size matters for real-world test generation from large codebases.

---

## Quick Evaluation Template

Fill this in after completing both experiments:

| Criteria                     | Qwen3-14B | Gemma 4 26B |
| ---------------------------- | --------- | ----------- |
| Test case quality (1–5)      |           |             |
| Hallucinated elements?       |           |             |
| Best temperature for testing |           |             |
| Context window handling      |           |             |
| Would you use in CI/CD?      |           |             |
| Response speed               |           |             |

---

## Bonus Experiment: Vision — Screenshot → Test Cases (Optional)

> This experiment uses [HuggingFace Playground](https://huggingface.co/playground) since the Vercel playground does not support image uploads.

Pick a multimodal model (e.g., **Qwen3-VL-8B-Instruct**). Take a screenshot of the foodora.lovable.app login page and upload it with this prompt:

> *Look at this screenshot of a web application. Identify all interactive elements and write 5 test scenarios that a QA engineer should cover. For each scenario, specify: the element under test, the action, and the expected result.*

### What to Observe

- How many interactive elements did it find?
- Did it hallucinate a button that doesn't exist?
- Is the output "ready-to-automate"?
- Compare: does the model find things you missed in a quick visual scan?
