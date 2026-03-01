import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Guest Checkout', async ({ page }) => {
    // Navigate to MacBook product to add to cart for checkout test
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to checkout page
    await page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify Register Account is selected by default
    const registerRadio = page.getByRole('radio', { name: 'Register Account' });
    await expect(registerRadio).toBeChecked();

    // Select Guest Checkout option
    const guestCheckoutRadio = page.getByRole('radio', { name: 'Guest Checkout' });
    await guestCheckoutRadio.click();

    // Verify Guest Checkout is now selected
    await expect(guestCheckoutRadio).toBeChecked();

    // Verify Register Account is no longer selected
    await expect(registerRadio).not.toBeChecked();

    // Fill personal details
    await page.getByRole('textbox', { name: '* First Name' }).fill('Emma');
    await page.getByRole('textbox', { name: '* Last Name' }).fill('Davis');
    await page.getByRole('textbox', { name: '* E-Mail' }).fill('emma.davis@example.com');

    // Fill shipping address
    await page.getByRole('textbox', { name: '* Address 1' }).fill('500 Boulevard Road');
    await page.getByRole('textbox', { name: '* City' }).fill('Bristol');
    await page.getByRole('textbox', { name: '* Post Code' }).fill('BS1 3AA');

    // Select country first
    const countrySelect = page.locator('select[name*="country_id"]').first();
    await countrySelect.selectOption('United Kingdom');
    
    // Wait for region dropdown to be populated
    await page.waitForTimeout(1000);
    
    // Select region
    const regionSelect = page.locator('select[name*="zone_id"]').first();
    await regionSelect.selectOption('Bristol');

    // Verify all required fields are filled correctly
    await expect(page.getByRole('textbox', { name: '* First Name' })).toHaveValue('Emma');
    await expect(page.getByRole('textbox', { name: '* Last Name' })).toHaveValue('Davis');
    await expect(page.getByRole('textbox', { name: '* E-Mail' })).toHaveValue('emma.davis@example.com');
    await expect(page.getByRole('textbox', { name: '* Address 1' })).toHaveValue('500 Boulevard Road');
    await expect(page.getByRole('textbox', { name: '* City' })).toHaveValue('Bristol');
    await expect(page.getByRole('textbox', { name: '* Post Code' })).toHaveValue('BS1 3AA');
    
    // Verify country is selected (United Kingdom has ID 222)
    await expect(countrySelect).toHaveValue('222');
    
    // Verify region is selected (Bristol has ID 3522)
    await expect(regionSelect).toHaveValue('3522');

    // Verify Continue button is enabled
    const continueButton = page.getByRole('button', { name: 'Continue' }).first();
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();

    // Verify still in Guest Checkout mode
    await expect(guestCheckoutRadio).toBeChecked();
  });
});
