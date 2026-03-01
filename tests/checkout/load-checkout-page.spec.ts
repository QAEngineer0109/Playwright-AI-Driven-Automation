// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Load Checkout Page', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify checkout page loads with required sections
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify Personal Details section heading
    await expect(page.getByText('Your Personal Details')).toBeVisible();
    
    // Verify Shipping Address section heading
    await expect(page.getByText('Shipping Address')).toBeVisible();
    
    // Verify Password section heading
    await expect(page.getByText('Your Password')).toBeVisible();
    
    // Verify form inputs are present
    await expect(page.getByRole('textbox', { name: '* First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* E-Mail' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Address 1' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* City' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Post Code' })).toBeVisible();
    await expect(page.locator('select[name*="country_id"]').first()).toBeVisible();
    await expect(page.locator('select[name*="zone_id"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    
    // Verify order summary table displays
    await expect(page.getByRole('table')).toBeVisible();
    
    // Verify product is shown in order summary
    await expect(page.getByRole('link', { name: 'MacBook' })).toBeVisible();
    
    // Verify quantity indicator
    await expect(page.getByText('1x')).toBeVisible();

    // Verify Register Account option is available (should be default)
    await expect(page.getByRole('radio', { name: 'Register Account' })).toBeVisible();

    // Verify Guest Checkout option is available
    await expect(page.getByRole('radio', { name: 'Guest Checkout' })).toBeVisible();

    // Verify Privacy Policy checkbox is visible
    await expect(page.getByRole('checkbox', { name: 'I have read and agree to the Privacy Policy' })).toBeVisible();

    // Verify Newsletter checkbox is visible
    await expect(page.getByRole('checkbox', { name: 'I wish to subscribe to the Your Store newsletter.' })).toBeVisible();

    // Verify Comments field is visible
    await expect(page.getByRole('textbox', { name: 'Add Comments About Your Order' })).toBeVisible();

    // Verify Continue button is visible
    await expect(page.getByRole('button', { name: 'Continue' }).first()).toBeVisible();
  });
});
