//Create a checkout page (step one: "Your Information") Class
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Format checks for values that change between runs.
// "SauceCard #31337": the card name followed by "#" and one or more digits
export const PAYMENT_INFO_FORMAT = /^SauceCard #\d+$/;
// "Total: $43.18": a dollar amount with any number of whole digits and two decimals
export const TOTAL_FORMAT = /^Total: \$\d+\.\d{2}$/;
// The confirmation message is fixed text, so it is compared exactly
export const ORDER_CONFIRMATION_MESSAGE = "Thank you for your order!";

export class CheckoutPage {
  get pageTitle() {
    return cy.get('[data-test="title"]', { timeout: 10000 });
  }
  get firstNameInput() {
    return cy.get("#first-name");
  }
  get lastNameInput() {
    return cy.get("#last-name");
  }
  get postalCodeInput() {
    return cy.get("#postal-code");
  }
  get continueButton() {
    return cy.get("#continue");
  }
  get cancelButton() {
    return cy.get("#cancel");
  }
  get errorMessage() {
    // Only rendered after a failed Continue (e.g. "Error: First Name is required")
    return cy.get('[data-test="error"]');
  }

  // --- Step two: "Checkout: Overview" (after Continue) ---
  get paymentInfoLabel() {
    // "Payment Information:"
    return cy.get('[data-test="payment-info-label"]');
  }
  get paymentInfoValue() {
    // e.g. "SauceCard #31337"
    return cy.get('[data-test="payment-info-value"]');
  }
  get shippingInfoValue() {
    // e.g. "Free Pony Express Delivery!"
    return cy.get('[data-test="shipping-info-value"]');
  }
  get subtotalLabel() {
    // e.g. "Item total: $39.98"
    return cy.get('[data-test="subtotal-label"]');
  }
  get taxLabel() {
    // e.g. "Tax: $3.20"
    return cy.get('[data-test="tax-label"]');
  }
  get totalLabel() {
    // e.g. "Total: $43.18" (includes the "Total: " prefix)
    return cy.get('[data-test="total-label"]');
  }
  get finishButton() {
    return cy.get("#finish");
  }

  // --- Step three: "Checkout: Complete!" (after Finish) ---
  get completeHeader() {
    // "Thank you for your order!"
    return cy.get('[data-test="complete-header"]');
  }

  /* Fill in the "Your Information" form
   * @param info: CheckoutInfo - first name, last name and postal code
   * @returns void
   */
  fillShippingInformation(info: CheckoutInfo): void {
    this.firstNameInput.type(info.firstName);
    this.lastNameInput.type(info.lastName);
    this.postalCodeInput.type(info.postalCode);
  }

  /* Click Continue and move to the next checkout step (the order overview).
   * Use this after the form is filled in correctly.
   * @returns void
   */
  continue(): void {
    this.continueButton.click();
    cy.url().should("include", "/checkout-step-two.html");
  }

  /* Verify the payment information value matches a format (not an exact value),
   * e.g. "SauceCard #31337"
   * @param format: RegExp - defaults to PAYMENT_INFO_FORMAT
   * @returns void
   */
  verifyPaymentInformation(format: RegExp = PAYMENT_INFO_FORMAT): void {
    // have.text only takes a string, so read the text and match the regex (retries until it passes)
    this.paymentInfoValue.invoke("text").should("match", format);
  }

  /* Verify the total matches a format (not an exact value), e.g. "Total: $43.18"
   * @param format: RegExp - defaults to TOTAL_FORMAT
   * @returns void
   */
  verifyTotal(format: RegExp = TOTAL_FORMAT): void {
    this.totalLabel.invoke("text").should("match", format);
  }

  /* Verify the overview page before finishing: payment information and total match
   * their formats, and the Finish button is visible.
   * @returns void
   */
  verifyOrderOverview(): void {
    this.verifyPaymentInformation();
    this.verifyTotal();
    this.finishButton.should("be.visible");
  }

  /* Click Finish to place the order
   * @returns void
   */
  confirmOrder(): void {
    this.finishButton.click();
  }

  /* Verify the confirmation page shows the thank-you message
   * @returns void
   */
  verifyOrderConfirmation(): void {
    this.completeHeader
      .should("be.visible")
      .and("have.text", ORDER_CONFIRMATION_MESSAGE);
  }
}
