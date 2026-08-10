# Experiment 1.4 (Bonus): Vision - Screenshot → Test Cases (Optional)

> **Time:** ~10 min · Uses [HuggingFace Playground](https://huggingface.co/playground), since the Vercel playground does not support image uploads.

## The Concept

Multimodal models can "look" at your app instead of reading its HTML. How well does that work for test design - and how much do they hallucinate?

## Steps

1. Pick a multimodal model (e.g., **Qwen3-VL-8B-Instruct**)
2. Take a screenshot of the foodora.lovable.app login page - or reuse [`../1-ModelBattle/files/foodora-homepage.png`](../1-ModelBattle/files/foodora-homepage.png) from Experiment 1.1
3. Upload it with this prompt:

   > *Look at this screenshot of a web application. Identify all interactive elements and write 5 test scenarios that a QA engineer should cover. For each scenario, specify: the element under test, the action, and the expected result.*

## What to Observe

- How many interactive elements did it find?
- Did it hallucinate a button that doesn't exist?
- Is the output "ready-to-automate"?
- Compare: does the model find things you missed in a quick visual scan?
