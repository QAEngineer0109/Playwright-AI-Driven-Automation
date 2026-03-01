// @ts-check
import { Page, Locator } from '@playwright/test';

/**
 * Checkout Page Object Model
 * Encapsulates all interactions with the checkout page
 */
export class CheckoutPage {
  readonly page: Page;

  // Personal Details Section
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly companyField: Locator;

  // Country & Region Section
  readonly countrySelect: Locator;
  readonly regionSelect: Locator;

  // Address Section
  readonly address1Field: Locator;
  readonly address2Field: Locator;
  readonly cityField: Locator;
  readonly postalCodeField: Locator;

  // Password Section
  readonly passwordField: Locator;
  readonly confirmPasswordField: Locator;

  // Checkboxes
  readonly registerAccountRadio: Locator;
  readonly guestCheckoutRadio: Locator;
  readonly privacyPolicyCheckbox: Locator;
  readonly newsletterCheckbox: Locator;

  // Comments
  readonly commentsField: Locator;

  // Payment Method
  readonly paymentMethodSection: Locator;
  readonly paymentChooseButton: Locator;

  // Order Summary
  readonly orderTable: Locator;

  // Additional sections
  readonly shippingSection: Locator;
  readonly passwordSection: Locator;
  readonly formContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Personal Details
    this.firstNameField = page.getByRole('textbox', { name: '* First Name' });
    this.lastNameField = page.getByRole('textbox', { name: '* Last Name' });
    this.emailField = page.getByRole('textbox', { name: '* E-Mail' });
    this.phoneField = page.getByRole('textbox', { name: 'Phone' });
    this.companyField = page.getByRole('textbox', { name: 'Company' });

    // Country & Region
    this.countrySelect = page.locator('select[name*="country_id"]').first();
    this.regionSelect = page.locator('select[name*="zone_id"]').first();

    // Address
    this.address1Field = page.getByRole('textbox', { name: '* Address 1' });
    this.address2Field = page.getByRole('textbox', { name: 'Address 2' });
    this.cityField = page.getByRole('textbox', { name: '* City' });
    this.postalCodeField = page.getByRole('textbox', { name: '* Post Code' });

    // Password
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.confirmPasswordField = page.getByRole('textbox', { name: 'Password Confirm' });

    // Checkboxes & Radios
    this.registerAccountRadio = page.getByRole('radio', { name: 'Register Account' });
    this.guestCheckoutRadio = page.getByRole('radio', { name: 'Guest Checkout' });
    this.privacyPolicyCheckbox = page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' });
    this.newsletterCheckbox = page.getByRole('checkbox', { name: 'Subscribe me to the newsletter' });

    // Comments
    this.commentsField = page.locator('textarea[name*="comment"]');

    // Payment & Summary
    this.paymentMethodSection = page.locator('text=Payment Method').first();
    this.paymentChooseButton = page.getByRole('button', { name: 'Choose' });
    this.orderTable = page.getByRole('table');

    // Sections
    this.shippingSection = page.locator('text=Delivery Address');
    this.passwordSection = page.locator('text=Password');
    this.formContainer = page.locator('form').first();
  }

  /**
   * Navigate to the checkout page
   */
  async goto() {
    await this.page.goto('https://www.cloudberrystore.services/index.php?route=checkout/checkout&language=en-gb');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill personal details for account registration
   */
  async fillPersonalDetails(details: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  }) {
    await this.firstNameField.fill(details.firstName);
    await this.lastNameField.fill(details.lastName);
    await this.emailField.fill(details.email);

    if (details.phone) {
      await this.phoneField.fill(details.phone);
    }

    if (details.company) {
      const companyField = this.page.getByRole('textbox', { name: 'Company' });
      if (await companyField.isVisible()) {
        await companyField.fill(details.company);
      }
    }
  }

  /**
   * Select country and region
   */
  async selectCountryAndRegion(countryId: string, regionId: string) {
    await this.countrySelect.selectOption(countryId);
    // Region dropdown needs time to populate after country selection
    await this.page.waitForTimeout(1000);
    await this.regionSelect.selectOption(regionId);
  }

  /**
   * Fill shipping/delivery address
   */
  async fillAddress(address: {
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
  }) {
    await this.address1Field.fill(address.address1);

    if (address.address2) {
      await this.address2Field.fill(address.address2);
    }

    await this.cityField.fill(address.city);
    await this.postalCodeField.fill(address.postalCode);
  }

  /**
   * Set password for account registration
   */
  async setPassword(password: string) {
    if (await this.passwordField.isVisible()) {
      await this.passwordField.fill(password);
      await this.confirmPasswordField.fill(password);
    }
  }

  /**
   * Select account type (Register or Guest)
   */
  async selectAccountType(type: 'register' | 'guest') {
    if (type === 'register') {
      await this.registerAccountRadio.check();
    } else {
      await this.guestCheckoutRadio.check();
    }
  }

  /**
   * Accept privacy policy
   */
  async acceptPrivacyPolicy() {
    await this.privacyPolicyCheckbox.check();
  }

  /**
   * Toggle newsletter subscription
   */
  async toggleNewsletter(subscribe: boolean) {
    if (subscribe) {
      await this.newsletterCheckbox.check();
    } else {
      await this.newsletterCheckbox.uncheck();
    }
  }

  /**
   * Add order comments
   */
  async addComments(comments: string) {
    await this.commentsField.fill(comments);
  }

  /**
   * Clear order comments
   */
  async clearComments() {
    await this.commentsField.clear();
  }

  /**
   * Check if a specific element is visible on the checkout page
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Verify all sections are visible
   */
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

  /**
   * Get product price from order summary
   */
  async getProductPrice(): Promise<string | null> {
    const priceText = this.orderTable.getByText('$602.00').first();
    if (await priceText.isVisible()) {
      return await priceText.textContent();
    }
    return null;
  }

  /**
   * Verify order summary contains MacBook
   */
  async verifyMacBookInSummary(): Promise<boolean> {
    return await this.orderTable.getByRole('link', { name: 'MacBook' }).first().isVisible();
  }

  /**
   * Get all form input fields
   */
  getFormFields() {
    return {
      firstName: this.firstNameField,
      lastName: this.lastNameField,
      email: this.emailField,
      phone: this.phoneField,
      company: this.companyField,
      address1: this.address1Field,
      address2: this.address2Field,
      city: this.cityField,
      postalCode: this.postalCodeField,
      password: this.passwordField,
      confirmPassword: this.confirmPasswordField,
    };
  }

  /**
   * Submit checkout form
   */
  async submitForm() {
    const submitButton = this.page.getByRole('button', { name: /continue|submit|place order/i }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }
  }
}
