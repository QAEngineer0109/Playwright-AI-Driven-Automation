// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Newsletter Subscription', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify newsletter checkbox appears on the checkout page
    const newsletterCheckbox = page.getByRole('checkbox', { name: 'I wish to subscribe to the Your Store newsletter.' });
    await expect(newsletterCheckbox).toBeVisible();

    // Verify newsletter checkbox is unchecked by default
    await expect(newsletterCheckbox).not.toBeChecked();

    // Check the newsletter subscription checkbox
    await newsletterCheckbox.click();

    // Verify newsletter checkbox is now checked
    await expect(newsletterCheckbox).toBeChecked();

    // Uncheck the newsletter subscription checkbox
    await newsletterCheckbox.click();

    // Verify newsletter checkbox is unchecked again
    await expect(newsletterCheckbox).not.toBeChecked();

    // Check it again for final state
    await newsletterCheckbox.click();
    await expect(newsletterCheckbox).toBeChecked();

    // Verify newsletter checkbox can be toggled multiple times
    await newsletterCheckbox.click();
    await expect(newsletterCheckbox).not.toBeChecked();

    await newsletterCheckbox.click();
    await expect(newsletterCheckbox).toBeChecked();
  });
});
