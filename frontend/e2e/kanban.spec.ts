import { test, expect, type Locator } from "@playwright/test";

function columnByTitle(page: import("@playwright/test").Page, title: string): Locator {
  return page.locator(`[data-testid="column"][data-column-title="${title}"]`);
}

test("kanban board core flow", async ({ page }) => {
  await page.goto("/");

  // Board loads with dummy data across all five columns.
  await expect(page.getByRole("heading", { name: "Kanban" })).toBeVisible();
  await expect(page.getByTestId("column")).toHaveCount(5);
  await expect(page.getByText("Define product roadmap")).toBeVisible();

  // Rename a column.
  const backlogTitle = columnByTitle(page, "Backlog").getByLabel("Column title");
  await backlogTitle.fill("Ideas");
  await backlogTitle.press("Enter");
  await expect(columnByTitle(page, "Ideas")).toBeVisible();

  // Add a card to the renamed column.
  const ideasColumn = columnByTitle(page, "Ideas");
  await ideasColumn.getByRole("button", { name: "Add a card" }).click();
  await page.getByPlaceholder("Card title").fill("Playwright coverage");
  await page.getByPlaceholder("Details (optional)").fill("Cover the core user flow.");
  await page.getByRole("button", { name: "Add card" }).click();
  await expect(ideasColumn.getByText("Playwright coverage")).toBeVisible();

  // Delete the card.
  await page
    .getByRole("button", { name: "Delete Playwright coverage", exact: true })
    .click();
  await expect(page.getByText("Playwright coverage")).not.toBeVisible();

  // Drag a card from "Ideas" into "To Do".
  const card = ideasColumn.getByText("Research competitor pricing");
  const toDoBody = columnByTitle(page, "To Do").getByTestId("column-body");

  const cardBox = await card.boundingBox();
  const targetBox = await toDoBody.boundingBox();
  if (!cardBox || !targetBox) throw new Error("Could not measure drag elements");

  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(cardBox.x + cardBox.width / 2 + 20, cardBox.y + cardBox.height / 2, {
    steps: 5,
  });
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height - 10,
    { steps: 10 }
  );
  await page.mouse.up();

  await expect(
    columnByTitle(page, "To Do").getByText("Research competitor pricing")
  ).toBeVisible();
  await expect(
    columnByTitle(page, "Ideas").getByText("Research competitor pricing")
  ).not.toBeVisible();
});
