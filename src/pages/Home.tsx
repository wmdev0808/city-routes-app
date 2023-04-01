import CityForm from "../components/CityForm";
import useCitySearchParams from "../hooks/useCitySearchParams";

function HomePage() {
  const [citySearchParams, setCitySearchParams] = useCitySearchParams();

  return (
    <CityForm {...citySearchParams} searchParamsUpdater={setCitySearchParams} />
  );
}

export default HomePage;
