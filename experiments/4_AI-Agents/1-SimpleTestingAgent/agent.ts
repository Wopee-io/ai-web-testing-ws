import { azure } from "@ai-sdk/azure";
import { generateText, hasToolCall, stepCountIs } from "ai";
import { reportStep } from "./utils/reporter.js";
import {
  startTesting,
  screenshotAndAnalyze,
  getActionInstructions,
  click,
  fill,
  stopTesting,
} from "./utils/tools.js";
import { systemPrompt as system, userPrompt as prompt } from "./config";
import { getStepNumber, incrementStepNumber } from "./utils/stepper.js";
import { TestInfo, Page } from "@playwright/test";
import { setPage, setTestInfo } from "./utils/playwright.js";

export async function agent(
  page: Page | undefined = undefined,
  testInfo: TestInfo | undefined = undefined
) {
  try {
    if (page) setPage(page);
    if (testInfo) setTestInfo(testInfo);

    const model = azure(process.env.AZURE_DEPLOYMENT_NAME || "gpt-4.1");

    const { text: responseText } = await generateText({
      model,
      system,
      prompt,
      tools: {
        startTesting,
        screenshotAndAnalyze,
        getActionInstructions,
        click,
        fill,
        stopTesting,
      },
      stopWhen: [stepCountIs(50), hasToolCall("stopTesting")],
      onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        incrementStepNumber();

        const toolName = toolCalls?.[0]?.toolName ?? "No tool calls";
        console.log(`\nStep #${getStepNumber()} Finished (${toolName})`);

        reportStep(text, toolCalls, toolResults, finishReason, usage);
      },
    });

    console.log("\n--- AGENT FINISHED ---");
    console.log(responseText);
    return responseText;
  } catch (error) {
    console.error(
      "Error in agent:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
