import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Automations");
});

test("templates gallery", async ({ page }) => {
  await page.goto("/templates");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Template gallery");
});
