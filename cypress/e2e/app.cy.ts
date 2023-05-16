import { format } from "date-fns";

describe("App", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get(".bp4-form-group").eq(0).as("cityOfOrigin");
    cy.get(".bp4-form-group").eq(1).as("cityOfDestination");
    cy.get(".bp4-form-group").eq(2).as("passengers");
    cy.get(".bp4-form-group").eq(3).as("date");
    const values = { today: format(new Date(), "MM/dd/yyyy") };
    cy.wrap(values).its("today").as("today");
  });

  // it("passes", () => {
  //   cy.visit("https://example.cypress.io");
  // });

  it("should render a form, `CityForm`", () => {
    cy.get(".city-form").within(() => {
      cy.get("@cityOfOrigin").within(() => {
        cy.contains("label", "City of origin").should(
          "have.class",
          "bp4-label",
        );
        cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");
        cy.get("input").should("have.attr", "placeholder", "Search...");
        cy.get("button.btn-remove-destination").should("not.be.visible");
        cy.get(".bp4-form-helper-text").should(
          "have.text",
          "You must choose the city of origin",
        );
      });

      cy.get("@cityOfDestination").within(() => {
        cy.contains("label", "City of destination").should(
          "have.class",
          "bp4-label",
        );
        cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");
        cy.get("input").should("have.attr", "placeholder", "Search...");
        cy.get("button.btn-remove-destination").should("not.be.visible");
        cy.get(".bp4-form-helper-text").should(
          "have.text",
          "You must choose the city of destination",
        );
      });

      cy.contains("button", "Add destination").should(
        "have.class",
        "bp4-button",
      );

      cy.get("@passengers").within(() => {
        cy.contains("label", "Passengers").should("have.class", "bp4-label");
        cy.get(".bp4-input-group").within(($inputGroup) => {
          cy.wrap($inputGroup).should("not.have.class", "bp4-intent-danger");
          cy.get("input").should("have.attr", "value", "1");
          cy.get("button").eq(0).should("have.attr", "aria-label", "decrement");
          cy.get("button").eq(1).should("have.attr", "aria-label", "increment");
        });
      });

      cy.get("@date").within(() => {
        cy.contains("label", "Date").should("have.class", "bp4-label");
        cy.get(".bp4-input-group").within(($inputGroup) => {
          cy.wrap($inputGroup).should("not.have.class", "bp4-intent-danger");
          cy.get("@today").then(($today) => {
            cy.get("input").should("have.attr", "value", $today);
          });
        });
      });

      cy.contains("button[type='submit']", "Submit")
        .should("have.class", "bp4-button")
        .and("be.disabled");
    });

    // Check if url is set for deep-linking
    const expectedCityParams = {
      cities: [{}, {}],
      passengers: 1,
      date: format(new Date(), "yyyy-MM-dd"),
    };

    cy.checkSearchParam("cities", JSON.stringify(expectedCityParams.cities));
    cy.checkSearchParam(
      "passengers",
      JSON.stringify(expectedCityParams.passengers),
    );
    cy.checkSearchParam("date", expectedCityParams.date);
  });

  context("CitySelect", () => {
    it("should be able to select a city asynchronously", () => {
      cy.selectCity("@cityOfOrigin", "p", "Paris");

      // Should update search param, cities accordingly
      const expectedCityParams = {
        cities: [
          { name: "Paris", latitude: 48.856614, longitude: 2.352222 },
          {},
        ],
      };

      cy.checkSearchParam("cities", JSON.stringify(expectedCityParams.cities));
    });

    it("should be able to delete a city", () => {
      cy.selectCity("@cityOfOrigin", "p", "Paris");
      cy.get("@cityOfOrigin").within(() => {
        cy.get(".bp4-input-group button")
          .find("span[icon='cross']")
          .as("btnDeleteCity")
          .click();

        cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");

        cy.contains(
          ".bp4-form-helper-text",
          "You must choose the city of origin",
        ).should("exist");
      });
    });

    it("should show no results dropdown if any matching citys do not exist", () => {
      cy.get("@cityOfOrigin").within(() => {
        cy.get("input[role='combobox']").type("xx");
      });
      cy.contains(".bp4-menu-item", "No results").click();
    });
  });

  context("CitySelectList", () => {
    it("should be able to add/remove a city select field dynamically", () => {
      // Add initial city origin and destination
      cy.selectCity("@cityOfOrigin", "p", "Paris");
      cy.selectCity("@cityOfDestination", "m", "Montpellier");

      cy.contains("button", "Add destination").click();
      cy.get(".city-form-fields > div")
        .eq(0)
        .as("citySelectList")
        .within(() => {
          cy.get("input[role='combobox']").should("have.length", 3);
          cy.get("label:contains(City of destination)").should(
            "have.length",
            2,
          );
          cy.get(".btn-remove-destination").last().click();
          cy.get("input[role='combobox']").should("have.length", 2);
        });
    });
  });
});
