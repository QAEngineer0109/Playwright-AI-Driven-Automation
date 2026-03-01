// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Order Summary Display', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for page to fully load - be patient with parallel execution
    await page.waitForLoadState('networkidle');

    // Verify order summary table is displayed
    const orderTable = page.getByRole('table');
    await expect(orderTable).toBeVisible();

    // Verify product details in order summary - MacBook should be visible
    // Use table context to find the specific MacBook link and use first() to disambiguate
    await expect(page.getByRole('table').getByRole('link', { name: 'MacBook' }).first()).toBeVisible();

    // Verify model information is shown (in table context to avoid ambiguity)
    await expect(page.getByRole('table').locator('text=Model: Product 16')).toBeVisible();

    // Verify reward points are shown (in table context)
    await expect(page.getByRole('table').locator('text=Reward Points: 600')).toBeVisible();

    // Verify product price is displayed ($602.00)
    const priceText = page.getByRole('table').getByText('$602.00').first();
    await expect(priceText).toBeVisible();

    // Verify Sub-Total is displayed (in table context)
    await expect(page.getByRole('table').getByText('Sub-Total')).toBeVisible();
    
    // Verify Eco Tax is displayed (in table context)
    await expect(page.getByRole('table').getByText('Eco Tax (-2.00)')).toBeVisible();

    // Verify VAT (20%) is displayed (in table context)
    await expect(page.getByRole('table').getByText('VAT (20%)')).toBeVisible();

    // Verify Total is displayed (in table context - use first to avoid ambiguity)
    const totalLabel = page.getByRole('table').getByText('Total').first();
    await expect(totalLabel).toBeVisible();

    // Verify quantity is shown as 1x
    const quantityLocator = page.getByRole('table').getByText('1x');
    // For parallel execution robustness, wait a bit longer for quantity to be visible
    await quantityLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(quantityLocator).toBeVisible();

    // Verify column headers are present
    await expect(page.getByRole('columnheader', { name: 'Product' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total' })).toBeVisible();
  });
});
