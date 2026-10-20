/// <reference types="cypress" />

import { LoginPage } from "../pages/loginPage";
import { ProductsPage } from "../pages/productsPage";

const loginPage = new LoginPage();
const productsPage = new ProductsPage();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logs in through the API and yields the token (for Restful Booker). */
      API_authTokenForRestfulBooker(): Chainable<string>;
      /** Gets a booking from the API and yields the response (for Restful Booker). */
      get_Booking(
        bookingId: string,
        failOnStatusCode?: boolean,
      ): Chainable<Response<any>>;
      /** Types the saucedemo credentials (from config.env) into the login form and submits (for Sauce Demo). */
      sauceDemo_login(): Chainable<void>;
      /** Visits the Sauce Demo home (login) page (for Sauce Demo). */
      navigateToHomePage(): Chainable<void>;
      /** Clicks the header cart icon and checks the cart page opened (works from any logged-in page). */
      navigateToCartPage(): Chainable<void>;
      /** Clicks the button (Add to cart / Remove) inside the product card with the given name. */
      clickItemButton(productName: string): Chainable<void>;
    }
  }
}

// -- Restful Booker (API) --
Cypress.Commands.add("API_authTokenForRestfulBooker", () => {
  return cy
    .env(["restfulBookerUsername", "restfulBookerPassword"])
    .then(({ restfulBookerUsername, restfulBookerPassword }) => {
      return cy
        .request("POST", `${Cypress.expose("restfulBookerUrl")}/auth`, {
          username: restfulBookerUsername,
          password: restfulBookerPassword,
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          // Restful Booker answers 200 even for bad credentials: { reason: "Bad credentials" }
          expect(response.body.token, "auth token").to.be.a("string").and.not.be
            .empty;
          // No cy.log() here: it would queue a cy command and then we'd return
          // a plain value from the same callback (the async/sync mix error).
          return response.body.token as string;
        });
    });
});

Cypress.Commands.add(
  "get_Booking",
  (bookingId: string, failOnStatusCode?: boolean) => {
    return cy.request({
      method: "GET",
      url: `${Cypress.expose("restfulBookerUrl")}/booking/${bookingId}`,
      failOnStatusCode: failOnStatusCode ?? true,
    });
  },
);

Cypress.Commands.add("sauceDemo_login", () => {
  cy.env(["saucedemoUsername", "saucedemoPassword"]).then(
    ({ saucedemoUsername, saucedemoPassword }) => {
      loginPage.username.type(saucedemoUsername);
      loginPage.password.type(saucedemoPassword, { log: false }); // keep the password out of the command log
      loginPage.loginButton.click();
      //Once user signs in, the URL does not change
      productsPage.pageHeader
        .should("be.visible")
        .and("contain.text", "Swag Labs");
    },
  );
});

// -- Reusable across Sauce Demo pages --
Cypress.Commands.add("navigateToHomePage", () => {
  cy.visit(Cypress.expose("saucedemoUrl"));
});

Cypress.Commands.add("navigateToCartPage", () => {
  // The container has an id (#shopping_cart_container) but the clickable
  // link inside it only has a data-test attribute.
  cy.get('#shopping_cart_container [data-test="shopping-cart-link"]').click();
  cy.url().should("include", "/cart.html");
});

// Product cards on the products page and the cart page share the same
// [data-test="inventory-item"] markup, so one command covers add and remove.
Cypress.Commands.add("clickItemButton", (productName: string) => {
  cy.contains('[data-test="inventory-item"]', productName)
    .find("button")
    .click();
});
