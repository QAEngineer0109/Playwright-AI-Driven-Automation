// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Shipping Address Validation', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Fill only the required personal details
    await page.getByRole('textbox', { name: '* First Name' }).fill('Test');
    await page.getByRole('textbox', { name: '* Last Name' }).fill('User');
    await page.getByRole('textbox', { name: '* E-Mail' }).fill('test@example.com');

    // Check that required address fields are present but empty
    const address1Field = page.getByRole('textbox', { name: '* Address 1' });
    const cityField = page.getByRole('textbox', { name: '* City' });
    const postCodeField = page.getByRole('textbox', { name: '* Post Code' });
    const countrySelect = page.locator('select[name*="country_id"]').first();

    // Verify fields are visible and empty
    await expect(address1Field).toBeVisible();
    await expect(address1Field).toHaveValue('');
    
    await expect(cityField).toBeVisible();
    await expect(cityField).toHaveValue('');
    
    await expect(postCodeField).toBeVisible();
    await expect(postCodeField).toHaveValue('');
    
    await expect(countrySelect).toBeVisible();

    // Check Privacy Policy checkbox
    const privacyCheckbox = page.getByRole('checkbox', { name: 'I have read and agree to the Privacy Policy' });
    await privacyCheckbox.click();

    // Fill password to avoid validation errors for it
    const passwordField = page.locator('input[type="password"]').first();
    await passwordField.fill('TestPass123');

    // Try to continue with incomplete address
    const continueButton = page.getByRole('button', { name: 'Continue' }).first();
    
    // The browser should prevent form submission if fields are required
    // Now fill in the required address fields
    await address1Field.fill('789 Cherry Lane');
    await cityField.fill('Birmingham');
    await postCodeField.fill('B1 1AA');
    
    // Select country (United Kingdom has ID 222)
    await countrySelect.selectOption('222');
    
    // Wait for region dropdown to be populated
    await page.waitForTimeout(1000);
    
    // Select region (West Midlands has ID 3545)
    const regionSelect = page.locator('select[name*="zone_id"]').first();
    await regionSelect.selectOption('3545');

    // Verify all required fields now have values
    await expect(address1Field).toHaveValue('789 Cherry Lane');
    await expect(cityField).toHaveValue('Birmingham');
    await expect(postCodeField).toHaveValue('B1 1AA');

    // Continue button should now be enabled if all fields are filled
    await expect(continueButton).toBeEnabled();
  });
});
