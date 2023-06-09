import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Spinner } from "@blueprintjs/core";
import { format } from "date-fns";

import type { Distance } from "../api/cities";
import { calculateHaversineDistance } from "../api/cities";
import DistanceIndicatorItem from "../components/DistanceIndicatorItem";
import useCitySearchParams from "../hooks/useCitySearchParams";
import PageContainer from "../components/UI/PageContainer";

const SearchResultsContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ContentRows = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 2rem 0;
  &.error-container {
    > div {
      margin: 2rem;
    }
  }
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  line-height: 2rem;
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: #7786d2;
`;

function SearchResultsPage() {
  const navigtate = useNavigate();
  const [citySearchParams] = useCitySearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [distances, setDistances] = useState<Distance[]>([]);

  useEffect(() => {
    async function fetchDistances() {
      setIsLoading(true);

      try {
        const cityDistances = await calculateHaversineDistance(
          citySearchParams.cities,
        );

        setDistances(cityDistances);
      } catch (error) {
        setError(error as Error);
      }
      setIsLoading(false);
    }

    fetchDistances();
  }, []);

  function handleClick() {
    navigtate(-1);
  }

  function calculateTotalDistance() {
    return distances.reduce((acc, item) => acc + item.distance, 0);
  }

  function formatDate(date: string, dateFormat: string) {
    return format(new Date(date), dateFormat);
  }

  function renderSearchResults() {
    if (isLoading) return <Spinner />;
    if (error)
      return (
        <PageContainer>
          <ContentRows className="error-container">
            <ContentRow>{error.message}</ContentRow>
            <ContentRow>
              <Button large onClick={handleClick} text="Back" />
            </ContentRow>
          </ContentRows>
        </PageContainer>
      );
    return (
      <PageContainer>
        {distances.map((distance, index) => (
          <DistanceIndicatorItem
            isFirst={index === 0}
            isLast={index === distances.length - 1}
            item={distance}
            key={index}
          />
        ))}

        <ContentRows>
          <ContentRow>
            <HighlightedText>{calculateTotalDistance()} km</HighlightedText>
            &nbsp;is total distance
          </ContentRow>
          <ContentRow>
            <HighlightedText>{citySearchParams.passengers}</HighlightedText>
            &nbsp;passengers
          </ContentRow>
          <ContentRow>
            <HighlightedText>
              {formatDate(citySearchParams.date, "MMM dd, yyyy")}
            </HighlightedText>
          </ContentRow>
        </ContentRows>
        <ContentRow>
          <Button large onClick={handleClick} text="Back" />
        </ContentRow>
      </PageContainer>
    );
  }

  return (
    <SearchResultsContainer>{renderSearchResults()}</SearchResultsContainer>
  );
}

export default SearchResultsPage;
