describe("BEON.tech Interview Tests - API", () => {
  it("Authentication for Restful Booker", () => {
    cy.API_authTokenForRestfulBooker().then((token) => {
      // Don't log the token: it is a live credential
      expect(token).to.be.a("string").and.not.be.empty;
    });
  });

  it("Create a booking", () => {
    cy.fixture("example.json").then((payload) => {
      cy.request({
        method: "POST",
        url: `${Cypress.expose("restfulBookerUrl")}/booking`,
        headers: {
          "Content-Type": "application/json",
        },
        body: payload.bookingPayload,
      }).then((response) => {
        expect(response.status).to.eq(200);
        Cypress.expose("bookingId", response.body.bookingid);
      });
    });
  });

  it("Read a booking", () => {
    cy.get_Booking(Cypress.expose("bookingId")).then((response) => {
      cy.fixture("example.json").then((payload) => {
        expect(response.body).to.deep.equal(payload.bookingPayload);
      });
    });
  });

  it("Update a booking", () => {
    cy.fixture("example.json").then((payload) => {
      const updatedDate = "2026-01-02";
      const updatedPayload = {
        ...payload.bookingPayload,
        bookingdates: {
          ...payload.bookingPayload.bookingdates,
          checkout: updatedDate,
        },
      };

      cy.API_authTokenForRestfulBooker().then((token) => {
        const cookieValue = `token=${token}`;
        cy.request({
          method: "PUT",
          url: `${Cypress.expose("restfulBookerUrl")}/booking/${Cypress.expose("bookingId")}`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Cookie: cookieValue,
          },
          body: updatedPayload,
        }).then((response) => {
          expect(response.body.bookingdates.checkout).to.eq(updatedDate);
        });
      });
    });
  });

  it("Delete a booking", () => {
    const failOnStatusCode = false;
    cy.API_authTokenForRestfulBooker().then((token) => {
      const cookieValue = `token=${token}`;
      cy.request({
        method: "DELETE",
        url: `${Cypress.expose("restfulBookerUrl")}/booking/${Cypress.expose("bookingId")}`,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieValue,
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
      });
      cy.get_Booking(Cypress.expose("bookingId"), failOnStatusCode).then(
        (response) => {
          expect(response.status).to.eq(404);
        },
      );
    });
  });
});
