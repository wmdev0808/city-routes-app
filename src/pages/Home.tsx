import CityForm from "../components/CityForm";
import useCitySearchParams from "../hooks/useCitySearchParams";

function HomePage() {
  const [citySearchParams] = useCitySearchParams();

  return <CityForm {...citySearchParams} />;
}

export default HomePage;
