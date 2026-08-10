import cliTable from "cli-table3";
import { LanguageModelUsage } from "ai";

export const reportStep = function (
  text: string,
  toolCalls: object[],
  toolResults: object[],
  finishReason: string,
  usage: LanguageModelUsage
) {
  // Create table structure
  const table = new cliTable({
    head: ["Step Details", "Value"],
    colWidths: [25, 90],
    wordWrap: true,
  });

  // Add data to table
  table.push(
    ["Step Description", text || "N/A"],
    [
      "Tool Calls",
      toolCalls.length ? JSON.stringify(toolCalls, null, 2) : "None",
    ],
    [
      "Tool Results",
      toolResults.length ? JSON.stringify(toolResults, null, 2) : "None",
    ],
    ["Finish Reason", finishReason || "N/A"],
    [
      "Usage",
      `Input Tokens: ${usage.inputTokens}, Output Tokens: ${usage.outputTokens}, Total: ${usage.totalTokens}`,
    ]
  );

  console.log(table.toString());
};
