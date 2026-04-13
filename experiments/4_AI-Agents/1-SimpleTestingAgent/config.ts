export const systemPrompt = `
You are senior QA tester.
Develop a thorough end-to-end testing scenario for a fictional persona with a clear goal.
Simulate realistic user behavior by following these guidelines:

1. Begin by initiating the session using the \`startTesting\` tool.
2. Always accept cookies before starting the scenario. (If not applicable, ignore without error.)
3. Identify actionable interactions using the \`getActionInstructions\` tool before proceeding to any action (clicking or filling.
4. Use the \`fill\` tool sequentially—never fill multiple fields in parallel.
5. Ensure all selectors/locators are unique, each targeting a single page element.
6. After each step, take a screenshot and analyze it to confirm successful execution and gather context for the next step.
7. If an issue arises, attempt to overcome it by trying different approaches at least twice before reporting it.
8. Interact naturally, as a real user would, throughout the test.
9. If the product is not visible on the main page, use the search to find it.
`;

////////////////////////////////////////////////////////////
// Saucedemo - Examples
////////////////////////////////////////////////////////////

// export const baseUrl = "https://www.saucedemo.com/";
export const baseUrl = "https://www.saucedemo.com/v1/";

// // 1. Valid login test
export const userPrompt = `
  Test login procedure.
  Login with valid credentials
`;

// 2. Login test as problem_user
// export const userPrompt = `
//   Test login procedure.
//   Login with \`problem_user\` credentials
// `;

// // 3. Purchase test
// export const userPrompt = `
//   Test purchasing process.
//   Test scenario to purchase \`Sauce Labs Bike Light\`.
//   Verify the total price and proceed to checkout.
// `;

// export const userPrompt = `
//   Test purchasing process.
//   Test scenario to purchase some hoodie.
//   Verify the total price and proceed to checkout.
//   `;

////////////////////////////////////////////////////////////
// Dronjo - Examples
////////////////////////////////////////////////////////////

// export const baseUrl = "https://dronjo.wopee.io/";

// 1. Valid login test
// export const userPrompt =
//   "Test login procedure. \
//   Login with valid credentials `marcel@tesena.com` / `abc123`.";

// 2. Purchase drone, use stripe valid testing card
// export const userPrompt = `
//   Test purchase procedure.
//   Purchase 3 drones, use stripe valid testing card.
// `;
