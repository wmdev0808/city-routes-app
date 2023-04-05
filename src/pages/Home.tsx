import CityForm from "../components/CityForm";
import PageContainer from "../components/UI/PageContainer";
import useCitySearchParams from "../hooks/useCitySearchParams";

function HomePage() {
  const [citySearchParams] = useCitySearchParams();

  return (
    <PageContainer>
      <CityForm {...citySearchParams} />
    </PageContainer>
  );
}

export default HomePage;
