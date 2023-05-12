import { act, renderHook } from "@testing-library/react";
import useCitySearchParams from "./useCitySearchParams";
import type { CityFormInputs } from "../components/CityForm";
import type { City } from "../api/cities";
import { format } from "date-fns";
import { BrowserRouter } from "react-router-dom";

describe("useCitySearchParams", () => {
  it("should have default value", () => {
    const citySearchParams: CityFormInputs = {
      cities: [{}, {}] as City[],
      passengers: "1",
      date: format(new Date(), "yyyy-MM-dd"),
    };

    const { result } = renderHook<
      [CityFormInputs, (cityFormInputs: CityFormInputs) => void],
      null
    >(() => useCitySearchParams(), { wrapper: BrowserRouter });

    expect(result.current[0]).toEqual(citySearchParams);
  });

  it("should update city form inputs", () => {
    const { result } = renderHook<
      [CityFormInputs, (cityFormInputs: CityFormInputs) => void],
      null
    >(() => useCitySearchParams(), { wrapper: BrowserRouter });

    const updatedSearchParams: CityFormInputs = {
      cities: [
        {
          name: "Paris",
          latitude: 48.856614,
          longitude: 2.352222,
        },
        {
          name: "Montpellier",
          latitude: 43.610769,
          longitude: 3.876716,
        },
      ],
      passengers: "1",
      date: "2023-05-09",
    };

    act(() => {
      result.current[1](updatedSearchParams);
    });

    expect(result.current[0]).toEqual(updatedSearchParams);
  });
});
