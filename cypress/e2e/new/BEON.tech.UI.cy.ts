import { ProductsPage } from "../../pages/productsPage";
import { CartPage } from "../../pages/cartPage";
import { CheckoutInfo, CheckoutPage } from "../../pages/checkoutPage";

describe("BEON.tech Interview Tests - UI", () => {
  let user: CheckoutInfo;

  before(() => {
    // cy.fixture() doesn't return the data directly; it's only available inside .then()
    cy.fixture<{ user1: CheckoutInfo }>("users.json").then((users) => {
      user = users.user1;
    });
  });

  it("Complete purchase flow with final verification", () => {
    const productsPage = new ProductsPage();
    const cartPage = new CartPage();
    const checkoutPage = new CheckoutPage();
    const products = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];
    //Navigate to the home page and login
    cy.navigateToHomePage();
    cy.sauceDemo_login();
    //Add two distinct items to the cart
    products.forEach((name) => productsPage.addToCartBasedOnProductName(name));
    //Navigate to the cart page and verify the items
    cy.navigateToCartPage();
    cartPage.verifyItemsInCart(products);
    //Checkout the items and complete the flow
    cartPage.checkoutButton.click();
    checkoutPage.pageTitle.should("have.text", "Checkout: Your Information");
    checkoutPage.fillShippingInformation(user);
    checkoutPage.continue();
    // verifyOrderOverview() checks the overview page that opens after Continue, before finishing:
    //  - payment information matches the format "SauceCard #<digits>" (e.g. SauceCard #31337)
    //  - total matches the format "Total: $<amount>.<2 decimals>" (e.g. Total: $43.18)
    //  - the Finish button is visible
    // No exact values are expected. All checks retry until they pass or the command timeout is reached.
    checkoutPage.verifyOrderOverview();
    // confirmOrder() clicks the Finish button to place the order
    checkoutPage.confirmOrder();
    // verifyOrderConfirmation() checks the confirmation page shows "Thank you for your order!"
    checkoutPage.verifyOrderConfirmation();
  });
});
