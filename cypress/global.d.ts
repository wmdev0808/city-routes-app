declare global {
  namespace Cypress {
    interface Chainable {
      checkSearchParam(key: string, expected: string): Chainable<void>;
      selectCity(
        containerSelector: string,
        query: string,
        cityName: string,
      ): Chainable<void>;
    }
  }
}

export {};
