import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Spinner } from "@blueprintjs/core";
import { format, parse } from "date-fns";

import { calculateHaversineDistance, Distance } from "../api/cities";
import DistanceIndicatorItem from "../components/DistanceIndicatorItem";
import useCitySearchParams from "../hooks/useCitySearchParams";

const SearchResultsContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ContentRows = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 2rem 0;
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const HighlightedText = styled.span`
  font-weight: bold;
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
          citySearchParams.cities
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
    if (error) return <div>{error.message}</div>;
    return (
      <ContentRows>
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
          <Button text="Back" onClick={handleClick} />
        </ContentRow>
      </ContentRows>
    );
  }

  return (
    <SearchResultsContainer>{renderSearchResults()}</SearchResultsContainer>
  );
}

export default SearchResultsPage;
