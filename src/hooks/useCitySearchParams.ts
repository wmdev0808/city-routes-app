import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

import { CityFormInputs } from "../components/CityForm";
import { City } from "../api/cities";

function useCitySearchParams(): [
  CityFormInputs,
  (cityFormInputs: CityFormInputs) => void
] {
  const [searchParams, setSearchParams] = useSearchParams();

  const citySearchParams: CityFormInputs = {
    cities: [{}, {}] as City[],
    passengers: "1",
    date: format(new Date(), "yyyy-MM-dd"),
  };

  for (const [key, value] of searchParams) {
    if (key === "cities") {
      citySearchParams.cities = JSON.parse(value);
    } else if (key === "passengers") {
      citySearchParams.passengers = value;
    } else if (key === "date") {
      citySearchParams.date = value;
    }
  }

  const setCitySearchParams = (citySearchParams: CityFormInputs) => {
    const serialized = {
      ...citySearchParams,
      cities: JSON.stringify(citySearchParams.cities),
    };

    setSearchParams(serialized);
  };

  return [citySearchParams, setCitySearchParams];
}

export default useCitySearchParams;
