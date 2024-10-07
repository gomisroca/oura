import { test, expect } from '@playwright/test';

test('has product list', async ({ page }) => {
  await page.goto('/sport/2/2');

  const productList = page.getByRole('list');
  await expect(productList).toContainText('Product 5');
});

test('product list changes when category is selected', async ({ page }) => {
  // Check the initial state
  await page.goto('/');

  // Check the state after clicking on a category
  await page.getByRole('button', { name: 'Categories' }).click();
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: 'Running' }).click();
  await page.getByRole('button', { name: 'Shoes' }).click();

  await page.waitForURL('**/sport/2/2');
  await expect(page.getByRole('list')).toBeVisible();
  await expect(page.getByRole('list')).toContainText('Product 5');

  // Check the state after clicking on a subcategory
  await page.getByRole('button', { name: 'Subcategories' }).click();
  await page.getByRole('button', { name: 'Trail' }).click();

  await page.waitForURL('**/sport/2/2/5');
  await expect(page.getByRole('list')).toBeVisible();
  await expect(page.getByRole('list')).toContainText('Product 5');
});
