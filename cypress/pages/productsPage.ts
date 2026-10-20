//Create a products (inventory) page Class
export class ProductsPage {
  get pageHeader() {
    //For asserting the page header is visible after login
    return cy.get(".app_logo", { timeout: 10000 });
  }
  get pageTitle() {
    return cy.get('[data-test="title"]');
  }
  get productItems() {
    return cy.get('[data-test="inventory-item"]');
  }
  get cartBadge() {
    // Only rendered once the cart has at least one item
    return cy.get('[data-test="shopping-cart-badge"]');
  }

  /* Add to Cart Based on Product Name
   * @param name: string - The name of the product to add to the cart
   * @returns void
   */
  addToCartBasedOnProductName(name: string): void {
    cy.clickItemButton(name);
  }
}
