import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tan/)
})

test('get started link', async ({ page }) => {
  await page.goto('/')

  // Click the get started link.
  await page.getByRole('link', { name: 'Address Form' }).click()

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByText('Full Name')).toBeVisible()
})
