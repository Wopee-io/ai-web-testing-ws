import "dotenv/config";
import { prepareCopilotAuthEnv } from "./auth.js";

async function main() {
  prepareCopilotAuthEnv();

  const { runAgent } = await import("./agent.js");
  await runAgent();
}

main().catch((err) => {
  console.error("Agent failed:", err);
  process.exit(1);
});
