import { z } from "zod";
import { azure } from "@ai-sdk/azure";
import { Page } from "@playwright/test";
import { Wopee } from "@wopee-io/wopee.pw";
import { getPage } from "../utils/playwright.js";
import { generateText, tool, UserModelMessage } from "ai";
import { baseUrl, systemPrompt, userPrompt } from "../config.js";
import { splitHtmlIntoChunks } from "../utils/splitHtmlIntoChunks.js";
import { assertPage, handleError, waitForLoader } from "../utils/utils.js";

let page: Page | undefined = undefined;

export const startTesting = tool({
  description: "Start testing with this tool.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      page = getPage();
      assertPage(page);

      await page.goto(baseUrl);
      return `Testing started with url: ${baseUrl}`;
    } catch (error) {
      return handleError(error, "startTesting");
    }
  },
});

export const click = tool({
  description: "Click an element by locator.",
  inputSchema: z.object({
    locator: z.string().describe("Element locator."),
  }),
  execute: async ({ locator }) => {
    try {
      assertPage(page);
      await page.waitForSelector(`${locator}`, {
        state: "attached",
      });
      const element = await page.$(locator);

      if (element) {
        await element.click();

        return `Clicked element \`${locator}\` successfully`;
      }
      return `Could not find element \`${locator}\``;
    } catch (error) {
      return handleError(error, "click");
    }
  },
});

export const fill = tool({
  description: "Fill an input field with a specified value.",
  inputSchema: z.object({
    locator: z.string().describe("Element locator."),
    value: z.string().describe("The text value to fill in."),
  }),
  execute: async ({ locator, value }) => {
    try {
      assertPage(page);
      await page.locator(locator).fill(value);

      return `Filled "${value}" into element matching locator: ${locator}`;
    } catch (error) {
      return handleError(error, "fill");
    }
  },
});

export const screenshotAndAnalyze = tool({
  description:
    "A tool for analyzing a screenshot to make sure that previous step conducted correctly and to provide detail information what is displayed for further processing.",
  inputSchema: z.object({ question: z.string() }),
  execute: async ({ question }) => {
    try {
      await waitForLoader(page);
      assertPage(page);

      const wopee = new Wopee();
      const { status, confidence, message } = await wopee.visualAssert({
        page,
        prompt: `You are analyzing a webpage screenshot to make sure that previous step conducted correctly
          and also to provide detail information what is displayed for further processing.
          
          This is task requested by the user: ${userPrompt}
        
          This is the question to analyze: ${question}`,
      });

      return `Analyzed for question: ${question}
      Result: ${message}
      Status: ${status}
      Confidence: ${confidence}`;
    } catch (error) {
      return handleError(error, "screenshotAndAnalyze");
    }
  },
});

export const getActionInstructions = tool({
  description: `Get the action instructions in JSON format for the current page.

    Examples:
     - Action: Click on the button with text 'Login'
     - Instructions: 
     {
      "action": "click",
      "locator": "a >> text=Login"
     }

     - Action: Fill in the email field with the value 'test@test.com'
     - Instructions: 
     {
      "action": "fill",
      "locator": "input[type='email']",
      "value": "test@test.com"
     }
  `,
  inputSchema: z.object({
    action: z.string().describe("The action to perform."),
  }),

  execute: async ({ action }) => {
    try {
      assertPage(page);

      const htmlChunks = splitHtmlIntoChunks(await page.content());

      if (htmlChunks.length > 1)
        console.log(`Splitting HTML into ${htmlChunks.length} chunks`);

      const responses: string[] = [];

      for (const chunk of htmlChunks) {
        const messages: UserModelMessage[] = [
          {
            role: "user",
            content: `Get instructions for action: "${action}" in JSON format for the current page I am providing HTML in chunks.
            Response should be in JSON format with no additional text. 
            
            When fields are divided into multiple segments (e.g., credit card numbers), ensure each segment is targeted with unique locator 
            and filled individually to prevent strict mode violation.
            
            Do not propose anything if action is not possible on this page - just return empty string.

            Examples:
              - Action: Click on the button with text 'Login'
              - Instructions: 
              {
                "action": "click",
                "locator": "a >> text=Login"
              }

              - Action: Fill in the email field with the value 'test@test.com'
              - Instructions: 
              {
                "action": "fill",
                "locator": "input[type='email']",
                "value": "test@test.com"
              }

              These instructions should be followed by the agent:
              ${systemPrompt}

              This is task requested by the user: 
              ${userPrompt}

              Within this HTML: ${chunk}`,
          },
        ];

        if (htmlChunks.length > 1)
          messages.push({
            role: "user",
            content:
              "If action is not possible on this page, do not propose anything, I will send another HTML fragment.",
          });

        const { text: responseText } = await generateText({
          messages,
          model: azure(process.env.AZURE_DEPLOYMENT_NAME || "gpt-4.1"),
        });

        responses.push(responseText);
      }

      return responses.join("\n\n");
    } catch (error) {
      return handleError(error, "getActionInstructions");
    }
  },
});

export const stopTesting = tool({
  description: "Stop testing and free resources.",
  inputSchema: z.object({}),
  execute: async () => {
    try {
      return "Testing stopped.";
    } catch (error) {
      return handleError(error, "stopTesting");
    }
  },
});
