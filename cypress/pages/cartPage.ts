//Create a cart page Class
export class CartPage {
  get pageTitle() {
    return cy.get('[data-test="title"]', { timeout: 10000 });
  }
  get cartItems() {
    return cy.get('[data-test="inventory-item"]');
  }
  get itemNames() {
    return cy.get('[data-test="inventory-item-name"]');
  }
  get continueShoppingButton() {
    return cy.get("#continue-shopping");
  }
  get checkoutButton() {
    return cy.get("#checkout");
  }

  /* Remove an item from the cart based on the product name
   * @param name: string - The name of the product to remove
   * @returns void
   */
  removeItemBasedOnProductName(name: string): void {
    cy.clickItemButton(name);
  }

  /* Verify the cart page is open and lists exactly the expected products
   * @param expectedNames: string[] - product names that must be in the cart
   * @returns void
   */
  verifyItemsInCart(expectedNames: string[]): void {
    cy.url().should("include", "/cart.html");
    this.pageTitle.should("have.text", "Your Cart");
    this.cartItems.should("have.length", expectedNames.length);
    this.itemNames.then(($names) => {
      const actualNames = [...$names].map((el) => el.textContent?.trim());
      expect(actualNames).to.have.members(expectedNames);
    });
  }
}
