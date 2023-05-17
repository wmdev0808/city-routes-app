/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * Assert a search param
 */
Cypress.Commands.add("checkSearchParam", (key: string, expected: string) => {
  cy.location().then((loc) => {
    const paramsString = loc.search.slice(1);
    const searchParams = new URLSearchParams(paramsString);

    cy.wrap(searchParams.has(key)).should("be.true");
    cy.wrap(searchParams.get(key)).should("deep.equal", expected);
  });
});

/**
 * Select a city
 */
Cypress.Commands.add(
  "selectCity",
  (containerSelector: string, query: string, cityName: string) => {
    cy.get(containerSelector).find("input[role='combobox']").type(query);
    cy.get("ul[role='listbox'] > li[role='option']").contains(cityName); // Wait until the cityName is visible
    cy.get("ul[role='listbox'] > li[role='option']")
      .as("cities")
      .should("have.length.gt", 0);
    cy.get("@cities").contains(cityName).click();
    cy.get("ul[role='listbox'] > li[role='option']")
      .contains(cityName)
      .should("not.be.visible");
    cy.get(containerSelector).within(() => {
      cy.get(".bp4-input-group").should("not.have.class", "bp4-intent-danger");
      cy.get("input").should("have.value", cityName);
      cy.get(".bp4-input-group button")
        .find("span[icon='cross']")
        .should("exist");
      cy.contains(
        ".bp4-form-helper-text",
        "You must choose the city of origin",
      ).should("not.exist");
    });
  },
);
