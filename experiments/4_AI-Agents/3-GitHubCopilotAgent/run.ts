import "dotenv/config";
import { runAgent } from "./agent";

runAgent().catch((err) => {
  console.error("Agent failed:", err);
  process.exit(1);
});
