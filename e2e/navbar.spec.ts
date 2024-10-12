import { test, expect } from '@playwright/test';

test('has initial buttons', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'oura' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Categories' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'General Menu' })).toBeVisible();
});

test('categories foldable is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Categories' })).toBeVisible();

  await page.getByRole('button', { name: 'Categories' }).click();

  await expect(page.getByRole('button', { name: 'Sports' })).toBeVisible();
});

test('general menu  foldable is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'General Menu' })).toBeVisible();

  await page.getByRole('button', { name: 'General Menu' }).click();

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('sign in button opens sign in modal', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'General Menu' })).toBeVisible();
  await page.getByRole('button', { name: 'General Menu' }).click();

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('button', { name: 'Email Modal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'google' })).toBeVisible();
});

test('theme button toggles theme', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'General Menu' })).toBeVisible();
  await page.getByRole('button', { name: 'General Menu' }).click();

  await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible();
  await page.getByRole('button', { name: 'Dark' }).click();

  await expect(page.getByRole('button', { name: 'Light' })).toBeVisible();
});

test('sign in with email works', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'General Menu' })).toBeVisible();
  await page.getByRole('button', { name: 'General Menu' }).click();

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('button', { name: 'Email Modal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'google' })).toBeVisible();

  // Click the button to open the modal
  const emailButton = page.getByRole('button', { name: 'Email Modal' });
  await emailButton.click();

  // Expect the modal to be visible
  const modal = page.locator('form');
  await expect(modal).toBeVisible();

  // Fill in the email input
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill('test@example.com');

  // Submit the form
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();

  // Expect the prompt message to be displayed
  await expect(page.locator('text=Check your email for a sign in link.')).toBeVisible();

  // Wait for the modal to close after 5 seconds
  await page.waitForTimeout(5000);
  await expect(modal).not.toBeVisible();
});
