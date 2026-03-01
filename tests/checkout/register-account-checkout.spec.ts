// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Register Account Checkout', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Verify Register Account option is selected by default
    const registerAccountRadio = page.getByRole('radio', { name: 'Register Account' });
    await expect(registerAccountRadio).toBeChecked();

    // Fill in personal details
    await page.getByRole('textbox', { name: '* First Name' }).fill('Alice');
    await page.getByRole('textbox', { name: '* Last Name' }).fill('Williams');
    await page.getByRole('textbox', { name: '* E-Mail' }).fill('alice.williams@example.com');

    // Fill in shipping address details
    await page.getByRole('textbox', { name: '* Address 1' }).fill('999 Church Street');
    await page.getByRole('textbox', { name: '* City' }).fill('Leeds');
    await page.getByRole('textbox', { name: '* Post Code' }).fill('LS1 1AA');
    
    // Select country (United Kingdom has ID 222)
    const countrySelect = page.locator('select[name*="country_id"]').first();
    await countrySelect.selectOption('222');
    
    // Wait for region dropdown to be populated
    await page.waitForTimeout(1000);
    
    // Select region/state (West Yorkshire has ID 3536)
    const regionSelect = page.locator('select[name*="zone_id"]').first();
    await regionSelect.selectOption('3536');

    // Fill in password
    const passwordField = page.locator('input[type="password"]').first();
    await passwordField.fill('NewAccount123!');

    // Accept privacy policy (required)
    const privacyCheckbox = page.getByRole('checkbox', { name: 'I have read and agree to the Privacy Policy' });
    await privacyCheckbox.click();
    await expect(privacyCheckbox).toBeChecked();

    // Verify all fields are filled
    await expect(page.getByRole('textbox', { name: '* First Name' })).toHaveValue('Alice');
    await expect(page.getByRole('textbox', { name: '* Last Name' })).toHaveValue('Williams');
    await expect(page.getByRole('textbox', { name: '* E-Mail' })).toHaveValue('alice.williams@example.com');
    await expect(page.getByRole('textbox', { name: '* Address 1' })).toHaveValue('999 Church Street');
    await expect(page.getByRole('textbox', { name: '* City' })).toHaveValue('Leeds');
    await expect(page.getByRole('textbox', { name: '* Post Code' })).toHaveValue('LS1 1AA');

    // Verify order summary displays
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('link', { name: 'MacBook' })).toBeVisible();

    // Verify Continue button is enabled
    const continueButton = page.getByRole('button', { name: 'Continue' }).first();
    await expect(continueButton).toBeEnabled();
  });
});
