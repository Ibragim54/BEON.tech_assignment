//Create a login page Class
export class LoginPage {
  get username() {
    return cy.get("#user-name");
  }
  get password() {
    return cy.get("#password");
  }
  get loginButton() {
    return cy.get("#login-button");
  }
}
