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
    cy.get("@date").find("input").invoke("val").as("currentDate");
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

    it("should show validation error if `fail` is entered", () => {
      cy.get("@cityOfOrigin").within(() => {
        cy.get("input[role='combobox']").type("fail");
      });
      cy.contains(
        ".bp4-form-helper-text",
        "Oops! Failed to search with this keyword.",
      );
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

  context("Passengers", () => {
    it("should have buttons to increase/decrease its value", () => {
      cy.get("@passengers").within(() => {
        cy.get("input[role='spinbutton']").should("have.value", 1);
        cy.get("button[aria-label='increment']").click();
        cy.get("input[role='spinbutton']").should("have.value", 2);
        cy.get("button[aria-label='decrement']").click();
        cy.get("input[role='spinbutton']").should("have.value", 1);
      });
    });

    it("should show error if the value is cleared", () => {
      cy.get("@passengers").within(() => {
        cy.get("input[role='spinbutton']").clear();
        cy.get("input[role='spinbutton']").should("not.have.value");
        cy.get("button[aria-label='decrement']").should("be.disabled");
        cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");
        cy.contains(".bp4-form-helper-text", "Field is required.");
      });
    });

    it("should only allow positive integers to be entered", () => {
      cy.get("@passengers").within(() => {
        cy.get("input[role='spinbutton']").clear();
        cy.get("input[role='spinbutton']").type("1");
        cy.get("input[role='spinbutton']").should("have.value", 1);
        cy.get("input[role='spinbutton']").clear();
        cy.get("input[role='spinbutton']").type("1.1");
        cy.get("input[role='spinbutton']").should("have.value", 11);
        cy.get("input[role='spinbutton']").clear();
        cy.get("input[role='spinbutton']").type("-1");
        cy.get("input[role='spinbutton']").should("have.value", 1);
        cy.get("input[role='spinbutton']").clear();
        cy.get("input[role='spinbutton']").type("-1.1");
        cy.get("input[role='spinbutton']").should("have.value", 11);
      });
    });

    it("should show error if zero is entered", () => {
      cy.get("@passengers").within(() => {
        cy.get("input[role='spinbutton']").clear();
        cy.get("input[role='spinbutton']").type("0");
        cy.get("input[role='spinbutton']").should("have.value", 0);
        cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");
        cy.contains(".bp4-form-helper-text", "Select passengers");
      });
    });
  });

  context("Date", () => {
    it("should be able to change date value using a date picker", () => {
      cy.get("@date").within(() => {
        cy.get("input").click();
      });
      cy.get(".bp4-datepicker").should("be.visible");

      cy.get("@currentDate").then(($currentDate) => {
        const originalDate = $currentDate;
        cy.get(".DayPicker-Day:not(.DayPicker-Day--selected)").first().click();
        cy.get("@date")
          .find("input")
          .invoke("val")
          .should("not.equal", originalDate);
      });
    });

    it("should show error if the field is cleared", () => {
      cy.get("@date").within(() => {
        cy.get("input").clear();
        cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");
        cy.get(".bp4-form-helper-text").contains("Field is required.");
      });
    });

    it("should show error if user change a earlier date than today", () => {
      cy.get("@date").within(() => {
        cy.get("input").click();
      });
      cy.get(".bp4-datepicker").should("be.visible");

      cy.get("@today").then(($today) => {
        cy.get(".DayPicker-Day:not(.DayPicker-Day--selected)").first().click();
        cy.get("@date")
          .find("input")
          .invoke("val")
          .then(($selected) => {
            cy.wrap(new Date($selected as string).getTime()).should(
              "be.lt",
              new Date($today as unknown as string).getTime(),
            );
          });

        cy.get("@date").within(() => {
          cy.get(".bp4-input-group").should("have.class", "bp4-intent-danger");
          cy.get(".bp4-form-helper-text").contains("Select a future date");
        });
      });
    });
  });

  it("should navigate to search results page when the form is submitted", () => {
    const inputCityParams = {
      cities: [
        {
          name: "Paris",
          latitude: 48.856614,
          longitude: 2.352222,
        },
        { latitude: 43.610769, longitude: 3.876716, name: "Montpellier" },
      ],
      passengers: 1,
      date: format(new Date(), "yyyy-MM-dd"),
    };

    const inputSearchParams = `cities=%5B%7B%22name%22%3A%22Paris%22%2C%22latitude%22%3A48.856614%2C%22longitude%22%3A2.352222%7D%2C%7B%22name%22%3A%22Montpellier%22%2C%22latitude%22%3A43.610769%2C%22longitude%22%3A3.876716%7D%5D&passengers=1&date=${inputCityParams.date}`;
    const searchResultsUrl = `/search-results?${inputSearchParams}`;
    const regExForDistance = /[+-]?(\d*\.\d+|\d+\.\d*|\d+) km/gm;

    cy.visit(`/?${inputSearchParams}`);

    // The form should be valid to be submitted
    cy.get("@cityOfOrigin").within(() => {
      cy.get("input").invoke("val").should("not.be.empty");
    });
    cy.get("@cityOfDestination").within(() => {
      cy.get("input").invoke("val").should("not.be.empty");
    });
    cy.get("@passengers").within(() => {
      cy.get("input").invoke("val").should("not.be.empty");
    });
    cy.get("@date").within(() => {
      cy.get("input").invoke("val").should("not.be.empty");
    });

    cy.get("form.city-form").within(() => {
      cy.get(".bp4-form-helper-text").should("not.exist");
      cy.contains("button", "Submit")
        .as("submitButton")
        .should("not.be.disabled");

      // Submit the form
      cy.get("@submitButton").click();
    });

    // Navigate to search results page
    cy.url().should("include", searchResultsUrl);
    cy.get(".bp4-spinner").should("not.exist");

    // Shows infos
    cy.contains(inputCityParams.cities[0].name).should(
      "have.class",
      "city-name",
    );
    cy.contains(inputCityParams.cities[1].name).should(
      "have.class",
      "city-name",
    );
    cy.get(".bp4-popover2-content").contains(regExForDistance);
    cy.get("main").within(() => {
      cy.contains(regExForDistance);
      cy.contains(`${inputCityParams.passengers} passengers`);
      cy.contains(`${format(new Date(inputCityParams.date), "MMM dd, yyyy")}`);
      cy.contains("button", "Back").as("backButton").should("not.be.disabled");
      cy.get("@backButton").click();
    });
  });

  it("should navigate to the search results page, but render , if `Dijon` city is selected on home page", () => {
    const inputCityParams = {
      cities: [
        {
          name: "Paris",
          latitude: 48.856614,
          longitude: 2.352222,
        },
        {
          name: "Dijon",
          latitude: 47.322047,
          longitude: 5.04148,
        },
      ],
      passengers: 1,
      date: format(new Date(), "yyyy-MM-dd"),
    };
    const inputUrl = `/?cities=%5B%7B%22name%22%3A%22Paris%22%2C%22latitude%22%3A48.856614%2C%22longitude%22%3A2.352222%7D%2C%7B%22name%22%3A%22Dijon%22%2C%22latitude%22%3A47.322047%2C%22longitude%22%3A5.04148%7D%5D&passengers=1&date=${inputCityParams.date}`;
    cy.visit(inputUrl);
    cy.contains("button", "Submit").click();
    cy.url().should("include", "/search-results");
    cy.contains("Oops! Something went wrong!").should("be.visible");
    cy.contains("button", "Back").should("not.be.disabled");
  });
});
