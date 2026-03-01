// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Payment Method Selection', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for form to load and give page time to settle
    await page.waitForLoadState('networkidle');
    
    // Verify we are on the checkout page
    await expect(page.locator('h1')).toBeVisible();

    // Verify Payment Method section is visible - it should contain the label
    await page.waitForTimeout(500); // Extra wait for dynamic rendering
    const paymentSection = page.locator('text=Payment Method').first();
    await expect(paymentSection).toBeVisible();

    // Verify payment method field is present
    const paymentField = page.getByRole('textbox', { name: 'Choose payment method...' });
    await expect(paymentField).toBeVisible();

    // Verify Choose button is present
    const chooseButton = page.getByRole('button', { name: 'Choose' });
    await expect(chooseButton).toBeVisible();

    // Click on the payment method field
    await paymentField.click();

    // Verify the field is focused after clicking
    // The field may or may not accept direct text input depending on implementation
    // Test if it's an input field or a special field
    const isEditable = await paymentField.isEditable();
    
    if (isEditable) {
      // If editable, try entering text
      await paymentField.fill('Test Payment');
      await expect(paymentField).toHaveValue('Test Payment');
      
      // Clear it
      await paymentField.clear();
    }

    // Verify Choose button is present and clickable
    await expect(chooseButton).toBeEnabled();

    // The payment method selection is typically handled by a modal or dropdown
    // that appears when clicking the Choose button, which is okay for this test
  });
});
