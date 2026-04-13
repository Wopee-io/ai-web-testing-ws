import { CopilotClient } from "@github/copilot-sdk";
import { config } from "./config";

const SYSTEM_PROMPT = `You are an automated QA tester. Your ONLY job is to execute browser tests using playwright-cli commands via the bash tool. Do NOT read files, search code, or do anything else — go straight to running playwright-cli commands.

Workflow — execute these steps NOW:
1. Open the browser: playwright-cli open ${config.baseUrl} --headed
2. Take a snapshot to see page structure: playwright-cli snapshot
3. Use element refs from snapshot to interact:
   - playwright-cli fill <ref> "text"
   - playwright-cli click <ref>
4. After each action, take a snapshot to verify the result
5. Take a screenshot at key moments: playwright-cli screenshot
6. When done, close the browser: playwright-cli close

Rules:
- Always snapshot before interacting to get current element refs
- Element refs look like [ref=e5] in snapshot output — use just the ref id (e.g. e5)
- If something fails, try a different approach at least twice before reporting failure
- Report your findings clearly at the end
- ONLY use the bash tool. Do not use grep, view, edit, or any other tool.`;

export async function runAgent() {
  const client = new CopilotClient();
  await client.start();

  const session = await client.createSession({
    model: config.model,
    streaming: true,
    onPermissionRequest: async () => ({ kind: "approved" }),
  });

  session.on("assistant.message_delta", (event) => {
    process.stdout.write(event.data.deltaContent ?? "");
  });

  session.on("tool.execution_start", (event) => {
    const args = event.data.arguments;
    const cmd =
      typeof args === "object" && args !== null && "command" in args
        ? (args as { command: string }).command
        : JSON.stringify(args);
    console.log(`\n--- [${event.data.toolName}] ${cmd} ---`);
  });

  session.on("tool.execution_complete", (event) => {
    // console.log(event.data);
  });

  const prompt = `${SYSTEM_PROMPT}\n\nExecute this test NOW:\n${config.testInstructions}`;

  console.log("Starting agent...\n");
  await session.sendAndWait({ prompt }, 5 * 60_000); // 5 minutes timeout

  console.log("\n\n--- Agent finished ---");
  await client.stop();
  process.exit(0);
}
