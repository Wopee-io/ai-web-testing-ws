import { test } from "@playwright/test";
import { agent } from "./agent";

test("Agent flow", async ({ page }, testInfo) => {
  test.setTimeout(5 * 60_000); // 5 minutes
  const status = await agent(page, testInfo);
  console.log("Agent execution status:", status);
});
