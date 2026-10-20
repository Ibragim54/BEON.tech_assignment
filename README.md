# BEON.tech Assignment - Cypress

Two exercises for the BEON.tech technical interview, written with Cypress and TypeScript:

1. **UI** - Sauce Demo purchase flow: login, add two distinct items, verify the cart, complete checkout, verify the confirmation message.
2. **API** - Restful Booker CRUD: create, read, update and delete a booking.

## Requirements

- Node.js 22, 24 or 26 or newer (Cypress 16 requirement)
- npm

## Setup

```bash
npm install
```

### Create the `.env` file

Credentials are never committed to this repository (`.env` is git-ignored), even though both sites below are public practice sites. Create a file named `.env` in the project root and fill in the values from the sources listed here:

```
SAUCEDEMO_USERNAME=
SAUCEDEMO_PASSWORD=
RESTFUL_BOOKER_USERNAME=
RESTFUL_BOOKER_PASSWORD=
```

| Variable                                             | Where to get it                                                                                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`           | Listed on the Sauce Demo login page, https://www.saucedemo.com ("Accepted usernames" and "Password for all users"). Use the `standard_user` account.      |
| `RESTFUL_BOOKER_USERNAME`, `RESTFUL_BOOKER_PASSWORD` | Published in the Restful Booker API docs, https://restful-booker.herokuapp.com/apidoc/index.html (the "Auth - CreateToken" section shows the demo login). |
| `RESTFUL_BOOKER_URL` (optional)                      | Defaults to https://restful-booker.herokuapp.com (set in `cypress.config.ts`). Only add it to point the API tests at a different host.                    |

The Sauce Demo URL (https://www.saucedemo.com/) is set in `cypress.config.ts` and needs no entry in `.env`.

Cypress 16 removed `Cypress.env()`. Secrets (usernames and passwords) are read with `cy.env([...])`, and public values such as URLs with `Cypress.expose()`. See `cypress.config.ts`.

## Run the tests

```bash
# Interactive mode
npm run cy:open        # same as: npx cypress open

# Headless, both specs
npm test               # same as: npx cypress run --browser chrome

# One spec
npx cypress run --browser chrome --spec "cypress/e2e/new/BEON.tech.UI.cy.ts"
npx cypress run --browser chrome --spec "cypress/e2e/new/BEON.tech.API.cy.ts"
```

An HTML report is written to `cypress/reports/` after `cypress run` (Mochawesome).

## Project structure

```
cypress/
  e2e/new/
    BEON.tech.UI.cy.ts      Sauce Demo purchase flow
    BEON.tech.API.cy.ts     Restful Booker CRUD
  pages/                    Page objects (locators and page-specific actions)
    loginPage.ts
    productsPage.ts
    cartPage.ts
    checkoutPage.ts
  support/
    commands.ts             Custom commands reused across pages
    e2e.ts                  Support file (loads commands and the reporter)
  fixtures/
    users.json              Checkout form data
    example.json            Booking payload for the API tests
cypress.config.ts           Cypress config (env/expose values, reporter, grep plugin)
```

### Custom commands (`cypress/support/commands.ts`)

| Command                                 | What it does                                                            |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `cy.navigateToHomePage()`               | Visits Sauce Demo                                                       |
| `cy.sauceDemo_login()`                  | Logs in with the credentials from `.env` and checks the page header     |
| `cy.navigateToCartPage()`               | Clicks the header cart icon and checks the cart page opened             |
| `cy.clickItemButton(name)`              | Clicks Add to cart / Remove inside the product card with the given name |
| `cy.API_authTokenForRestfulBooker()`    | Requests an auth token and yields it                                    |
| `cy.get_Booking(id, failOnStatusCode?)` | `GET /booking/:id`                                                      |

## What the tests cover

### UI - `BEON.tech.UI.cy.ts`

1. Log in with the standard user.
2. Add two distinct products by name (found dynamically, no hard-coded button selectors).
3. Open the cart through the cart icon and verify exactly those two items are listed.
4. Fill in the checkout form (data from `fixtures/users.json`) and continue.
5. On the overview page, verify the payment information and total match their formats (`SauceCard #<digits>`, `Total: $<amount>`) and that the Finish button is visible.
6. Finish the order and verify the message "Thank you for your order!".

### API - `BEON.tech.API.cy.ts`

The tests share one booking, so they depend on each other and run in order:

1. **Create** a booking (`POST /booking`) and store its id.
2. **Read** it (`GET /booking/:id`) and compare it to the payload.
3. **Update** it (`PUT /booking/:id`) with an auth token sent as a cookie.
4. **Delete** it (`DELETE /booking/:id`) and confirm a later `GET` returns 404.

Do not run these with `.only` on a single test, because the later tests need the booking id from the first one.

## Notes

- Restful Booker answers `200` with `{ "reason": "Bad credentials" }` for a wrong login, so the auth command asserts the token is a non-empty string.
- Tests can be tagged and filtered with `@cypress/grep`, for example `npx cypress run --expose grepTags=@smoke`.
- Formatting follows `.prettierrc`.
