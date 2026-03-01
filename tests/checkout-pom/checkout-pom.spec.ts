// @ts-check
// spec: test-plans/cloudberry-store-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Page, Locator } from '@playwright/test';

/**
 * Checkout Page Object Model
 * Encapsulates all interactions with the checkout page
 */
class CheckoutPage {
  readonly page: Page;

  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly address1Field: Locator;
  readonly address2Field: Locator;
  readonly cityField: Locator;
  readonly postalCodeField: Locator;
  readonly passwordField: Locator;
  readonly confirmPasswordField: Locator;
  readonly countrySelect: Locator;
  readonly regionSelect: Locator;
  readonly registerAccountRadio: Locator;
  readonly guestCheckoutRadio: Locator;
  readonly privacyPolicyCheckbox: Locator;
  readonly newsletterCheckbox: Locator;
  readonly commentsField: Locator;
  readonly orderTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.getByRole('textbox', { name: '* First Name' });
    this.lastNameField = page.getByRole('textbox', { name: '* Last Name' });
    this.emailField = page.getByRole('textbox', { name: '* E-Mail' });
    this.phoneField = page.getByRole('textbox', { name: 'Phone' });
    this.address1Field = page.getByRole('textbox', { name: '* Address 1' });
    this.address2Field = page.getByRole('textbox', { name: 'Address 2' });
    this.cityField = page.getByRole('textbox', { name: '* City' });
    this.postalCodeField = page.getByRole('textbox', { name: '* Post Code' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.confirmPasswordField = page.getByRole('textbox', { name: 'Password Confirm' });
    this.countrySelect = page.locator('select[name*="country_id"]').first();
    this.regionSelect = page.locator('select[name*="zone_id"]').first();
    this.registerAccountRadio = page.getByRole('radio', { name: 'Register Account' });
    this.guestCheckoutRadio = page.getByRole('radio', { name: 'Guest Checkout' });
    this.privacyPolicyCheckbox = page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' });
    this.newsletterCheckbox = page.getByRole('checkbox', { name: 'Subscribe me to the newsletter' });
    this.commentsField = page.locator('textarea[name*="comment"]');
    this.orderTable = page.getByRole('table');
  }

  async goto() {
    await this.page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');
    await this.page.waitForLoadState('networkidle');
  }

  async fillPersonalDetails(details: { firstName: string; lastName: string; email: string; phone?: string }) {
    await this.firstNameField.fill(details.firstName);
    await this.lastNameField.fill(details.lastName);
    await this.emailField.fill(details.email);
    if (details.phone) await this.phoneField.fill(details.phone);
  }

  async selectCountryAndRegion(countryId: string, regionId: string) {
    await this.countrySelect.selectOption(countryId);
    await this.page.waitForTimeout(1000);
    await this.regionSelect.selectOption(regionId);
  }

  async fillAddress(address: { address1: string; address2?: string; city: string; postalCode: string }) {
    await this.address1Field.fill(address.address1);
    if (address.address2) await this.address2Field.fill(address.address2);
    await this.cityField.fill(address.city);
    await this.postalCodeField.fill(address.postalCode);
  }

  async setPassword(password: string) {
    if (await this.passwordField.isVisible()) {
      await this.passwordField.fill(password);
      await this.confirmPasswordField.fill(password);
    }
  }

  async selectAccountType(type: 'register' | 'guest') {
    if (type === 'register') await this.registerAccountRadio.check();
    else await this.guestCheckoutRadio.check();
  }

  async acceptPrivacyPolicy() {
    await this.privacyPolicyCheckbox.check();
  }

  async toggleNewsletter(subscribe: boolean) {
    if (subscribe) await this.newsletterCheckbox.check();
    else await this.newsletterCheckbox.uncheck();
  }

  async addComments(comments: string) {
    await this.commentsField.fill(comments);
  }

  async clearComments() {
    await this.commentsField.clear();
  }

  async verifyAllSectionsVisible() {
    const personalDetailsSection = this.page.locator('text=Personal Details');
    const deliveryAddressSection = this.page.locator('text=Delivery Address');
    const orderSummarySection = this.page.locator('text=Order Summary');
    return (
      (await personalDetailsSection.isVisible()) &&
      (await deliveryAddressSection.isVisible()) &&
      (await orderSummarySection.isVisible())
    );
  }

  async verifyMacBookInSummary(): Promise<boolean> {
    return await this.orderTable.getByRole('link', { name: 'MacBook' }).first().isVisible();
  }
}

test.describe('Checkout Process - POM', () => {
  test('Load Checkout Page with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);

    // Navigate to MacBook product to add to cart
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Act
    await checkoutPage.goto();

    // Assert
    expect(await checkoutPage.verifyAllSectionsVisible()).toBe(true);
  });

  test('Register Account Checkout with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act
    await checkoutPage.selectAccountType('register');
    await checkoutPage.fillPersonalDetails({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    });
    await checkoutPage.selectCountryAndRegion('222', '3545');
    await checkoutPage.fillAddress({
      address1: '123 Main Street',
      city: 'Birmingham',
      postalCode: 'B1 1AA',
    });
    await checkoutPage.setPassword('Password123');
    await checkoutPage.acceptPrivacyPolicy();

    // Assert
    await expect(checkoutPage.registerAccountRadio).toBeChecked();
    await expect(checkoutPage.privacyPolicyCheckbox).toBeChecked();
  });

  test('Guest Checkout with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act
    await checkoutPage.selectAccountType('guest');
    await checkoutPage.fillPersonalDetails({
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@example.com',
    });
    await checkoutPage.selectCountryAndRegion('222', '3522');
    await checkoutPage.fillAddress({
      address1: '500 Boulevard Road',
      city: 'Bristol',
      postalCode: 'BS1 3AA',
    });
    await checkoutPage.acceptPrivacyPolicy();

    // Assert
    await expect(checkoutPage.guestCheckoutRadio).toBeChecked();
    await expect(checkoutPage.privacyPolicyCheckbox).toBeChecked();
  });

  test('Shipping Address Validation with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act
    await checkoutPage.fillPersonalDetails({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    });

    // Assert - Verify all required address fields are present but empty
    const fields = [
      checkoutPage.address1Field,
      checkoutPage.cityField,
      checkoutPage.postalCodeField,
    ];

    for (const field of fields) {
      await expect(field).toBeVisible();
      const value = await field.inputValue();
      expect(value).toBe('');
    }
  });

  test('Order Summary Display with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Assert
    await expect(checkoutPage.orderTable).toBeVisible();
    expect(await checkoutPage.verifyMacBookInSummary()).toBe(true);

    // Verify model information
    await expect(checkoutPage.orderTable.locator('text=Model: Product 16')).toBeVisible();

    // Verify quantity
    await expect(
      checkoutPage.orderTable.getByText('1x')
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false)
    ).resolves.toBe(true);
  });

  test('Privacy Policy Acceptance with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act
    await checkoutPage.fillPersonalDetails({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
    });
    await checkoutPage.selectCountryAndRegion('222', '3553');
    await checkoutPage.fillAddress({
      address1: '789 Oxford Street',
      city: 'London',
      postalCode: 'E1 7PT',
    });
    await checkoutPage.acceptPrivacyPolicy();

    // Assert
    await expect(checkoutPage.privacyPolicyCheckbox).toBeChecked();
  });

  test('Newsletter Subscription with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act - Toggle newsletter multiple times
    await checkoutPage.toggleNewsletter(true);
    await expect(checkoutPage.newsletterCheckbox).toBeChecked();

    await checkoutPage.toggleNewsletter(false);
    await expect(checkoutPage.newsletterCheckbox).not.toBeChecked();

    await checkoutPage.toggleNewsletter(true);

    // Assert
    await expect(checkoutPage.newsletterCheckbox).toBeChecked();
  });

  test('Order Comments with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act
    const testComment = 'Please deliver on weekdays only';
    await checkoutPage.addComments(testComment);
    await expect(checkoutPage.commentsField).toHaveValue(testComment);

    await checkoutPage.clearComments();

    // Assert
    await expect(checkoutPage.commentsField).toHaveValue('');
  });

  test('Payment Method Selection with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act
    const paymentSection = page.locator('text=Payment Method').first();

    // Assert
    await expect(paymentSection).toBeVisible();
    const chooseButton = page.getByRole('button', { name: 'Choose' });
    await expect(chooseButton).toBeVisible();
  });

  test('Complete Checkout Flow with POM', async ({ page }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await page.goto('https://www.cloudberrystore.services/index.php?route=product/product&language=en-gb&product_id=43');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await checkoutPage.goto();

    // Act - Full checkout flow
    await checkoutPage.selectAccountType('register');
    await checkoutPage.fillPersonalDetails({
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phone: '0131 123 4567',
    });
    await checkoutPage.selectCountryAndRegion('222', '3546');
    await checkoutPage.fillAddress({
      address1: '42 High Street',
      city: 'Edinburgh',
      postalCode: 'EH1 1QN',
    });
    await checkoutPage.setPassword('SecurePass123');
    await checkoutPage.acceptPrivacyPolicy();

    // Assert
    await expect(checkoutPage.registerAccountRadio).toBeChecked();
    await expect(checkoutPage.privacyPolicyCheckbox).toBeChecked();
    expect(await checkoutPage.verifyMacBookInSummary()).toBe(true);
  });
});
