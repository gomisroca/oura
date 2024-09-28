import { test, expect } from '@playwright/test';

test('has initial buttons', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Logo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sports' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'General Menu' })).toBeVisible();
});

test('sport foldable is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Sports' })).toBeVisible();

  await page.getByRole('button', { name: 'Sports' }).click();

  await expect(page.getByRole('button', { name: 'Running' })).toBeVisible();
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
