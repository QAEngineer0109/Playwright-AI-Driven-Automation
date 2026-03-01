// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Complete Checkout Flow', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Verify success message appears
    await expect(page.getByText(/Success: You have added/)).toBeVisible();

    // Verify cart contains product
    const cartButton = page.getByRole('button').filter({ hasText: /item/ });
    await expect(cartButton).toBeVisible();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Verify we are on checkout page
    await expect(page.getByRole('heading', { name: 'Checkout', level: 1 })).toBeVisible();

    // Step 1: Complete Personal Details
    await page.getByRole('textbox', { name: '* First Name' }).fill('Michael');
    await page.getByRole('textbox', { name: '* Last Name' }).fill('Brown');
    await page.getByRole('textbox', { name: '* E-Mail' }).fill('michael.brown@example.com');

    // Step 2: Complete Shipping Address
    const companyField = page.getByRole('textbox', { name: 'Company' });
    if (await companyField.isVisible()) {
      await companyField.fill('Brown Enterprises');
    }
    
    await page.getByRole('textbox', { name: '* Address 1' }).fill('100 High Street');
    
    // Address 2 is optional
    const address2Field = page.getByRole('textbox', { name: 'Address 2' });
    if (await address2Field.isVisible()) {
      await address2Field.fill('Suite 200');
    }

    await page.getByRole('textbox', { name: '* City' }).fill('Edinburgh');
    await page.getByRole('textbox', { name: '* Post Code' }).fill('EH1 3AA');
    
    // Select country (United Kingdom has ID 222)
    const countrySelect = page.locator('select[name*="country_id"]').first();
    await countrySelect.selectOption('222');
    
    // Wait for region dropdown to be populated
    await page.waitForTimeout(1000);
    
    // Select region (Edinburgh has ID 3546)
    const regionSelect = page.locator('select[name*="zone_id"]').first();
    await regionSelect.selectOption('3546');

    // Step 3: Set Password
    await page.getByRole('textbox', { name: '* Password' }).fill('SecurePassword2024!');

    // Step 4: Handle Newsletter Subscription (optional)
    const newsletterCheckbox = page.getByRole('checkbox', { name: 'I wish to subscribe to the Your Store newsletter.' });
    if (await newsletterCheckbox.isVisible()) {
      // Click to subscribe
      await newsletterCheckbox.click();
      await expect(newsletterCheckbox).toBeChecked();
    }

    // Step 5: Add Order Comments (optional)
    const commentsField = page.getByRole('textbox', { name: 'Add Comments About Your Order' });
    if (await commentsField.isVisible()) {
      await commentsField.fill('Please leave the package at the door if not home.');
    }

    // Step 6: Accept Privacy Policy (required)
    const privacyCheckbox = page.getByRole('checkbox', { name: 'I have read and agree to the Privacy Policy' });
    await privacyCheckbox.click();
    await expect(privacyCheckbox).toBeChecked();

    // Verify Order Summary is still visible
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('link', { name: 'MacBook' })).toBeVisible();
    
    // Verify pricing is displayed
    await expect(page.getByRole('table').getByText('$602.00').first()).toBeVisible();
    await expect(page.getByRole('table').getByText('Sub-Total')).toBeVisible();

    // Step 7: Verify Continue button is enabled
    const continueButton = page.getByRole('button', { name: 'Continue' }).first();
    await expect(continueButton).toBeEnabled();

    // Verify all required fields are filled with correct values
    await expect(page.getByRole('textbox', { name: '* First Name' })).toHaveValue('Michael');
    await expect(page.getByRole('textbox', { name: '* Last Name' })).toHaveValue('Brown');
    await expect(page.getByRole('textbox', { name: '* E-Mail' })).toHaveValue('michael.brown@example.com');
    await expect(page.getByRole('textbox', { name: '* City' })).toHaveValue('Edinburgh');
    await expect(page.getByRole('textbox', { name: '* Post Code' })).toHaveValue('EH1 3AA');

    // Step 8: Click Continue to proceed (optional - only if we want to test the next step)
    // Uncomment the line below if you want to proceed to the next checkout step
    // await continueButton.click();
  });
});
