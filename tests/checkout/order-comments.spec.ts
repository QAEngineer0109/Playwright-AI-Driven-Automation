// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Order Comments', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify comments section is visible on the checkout page
    const commentsField = page.locator('textarea[name*="comment"]');
    await expect(commentsField).toBeVisible();

    // Verify comments section label is visible
    const commentsLabel = page.getByText('Add Comments About Your Order');
    await expect(commentsLabel).toBeVisible();

    // Enter comments about the order
    const testComment = 'Please handle with care. This is a glass item.';
    await commentsField.fill(testComment);

    // Verify the comments are captured in the field
    await expect(commentsField).toHaveValue(testComment);

    // Test clearing the comments
    await commentsField.clear();
    await expect(commentsField).toHaveValue('');

    // Enter a different set of comments
    const anotherComment = 'Special delivery instructions: please ring doorbell twice.';
    await commentsField.fill(anotherComment);
    await expect(commentsField).toHaveValue(anotherComment);

    // Test that comments can be left empty (optional field)
    await commentsField.clear();
    await expect(commentsField).toHaveValue('');

    // Verify that the comments field does not have a required attribute (it's optional)
    const hasRequired = await commentsField.getAttribute('required');
    expect(hasRequired).toBeNull();

    // Fill comments one more time for final state
    await commentsField.fill('Please deliver after 5 PM on weekdays.');
    await expect(commentsField).toHaveValue('Please deliver after 5 PM on weekdays.');

    // Verify field is still editable after multiple interactions
    await commentsField.clear();
    await expect(commentsField).toHaveValue('');

    const finalComment = 'Special handling required - fragile items inside.';
    await commentsField.fill(finalComment);
    await expect(commentsField).toHaveValue(finalComment);
  });
});
