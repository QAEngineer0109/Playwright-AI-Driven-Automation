// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Privacy Policy Acceptance', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Verify Privacy Policy checkbox is present
    const privacyCheckbox = page.getByRole('checkbox', { name: 'I have read and agree to the Privacy Policy' });
    await expect(privacyCheckbox).toBeVisible();

    // Verify it is unchecked by default
    const isChecked = await privacyCheckbox.isChecked();
    await expect(isChecked).toBeFalsy();

    // Verify Privacy Policy link is present and visible
    const privacyLink = page.getByRole('link').filter({ hasText: 'Privacy Policy' });
    await expect(privacyLink.first()).toBeVisible();

    // Fill all required fields except privacy policy checkbox
    await page.getByRole('textbox', { name: '* First Name' }).fill('John');
    await page.getByRole('textbox', { name: '* Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: '* E-Mail' }).fill('john@example.com');
    await page.getByRole('textbox', { name: '* Address 1' }).fill('123 Main St');
    await page.getByRole('textbox', { name: '* City' }).fill('London');
    await page.getByRole('textbox', { name: '* Post Code' }).fill('SW1A 1AA');
    
    // Select country (United Kingdom has ID 222)
    const countrySelect = page.locator('select[name*="country_id"]').first();
    await countrySelect.selectOption('222');
    
    // Wait for region dropdown to be populated
    await page.waitForTimeout(1000);
    
    // Select region (Greater London has ID 3553)
    const regionSelect = page.locator('select[name*="zone_id"]').first();
    await regionSelect.selectOption('3553');
    
    const passwordField = page.locator('input[type="password"]').first();
    await passwordField.fill('Pass123');

    // Now check the Privacy Policy checkbox
    await privacyCheckbox.click();

    // Verify it is now checked after clicking
    await expect(privacyCheckbox).toBeChecked();

    // Click again to uncheck
    await privacyCheckbox.click();

    // Verify it is unchecked
    await expect(privacyCheckbox).not.toBeChecked();

    // Check it again for final state
    await privacyCheckbox.click();
    await expect(privacyCheckbox).toBeChecked();

    // Verify the Continue button is still visible and can be enabled
    const continueButton = page.getByRole('button', { name: 'Continue' }).first();
    await expect(continueButton).toBeEnabled();
  });
});
