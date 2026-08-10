import { test, expect } from "@playwright/test";

// Setup verification: `npm test` runs this to confirm your environment works.
// It opens the workshop SUT and checks the homepage rendered.
test("workshop setup check: Foodora homepage loads", async ({ page }) => {
  await page.goto("https://foodora.lovable.app/");
  await expect(page).toHaveTitle(/foodora/i);
  await expect(
    page.getByRole("heading", { name: /delicious food/i })
  ).toBeVisible();
});
