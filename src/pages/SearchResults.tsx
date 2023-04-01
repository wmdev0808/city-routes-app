import { Button } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SearchResultsContainer = styled.div`
  display: flex;
  flex: 1;
`;

function SearchResultsPage() {
  const navigtate = useNavigate();

  function handleClick() {
    navigtate(-1);
  }
  return (
    <SearchResultsContainer>
      <div>Search Results Page</div>
      <Button text="Back" onClick={handleClick} />
    </SearchResultsContainer>
  );
}

export default SearchResultsPage;
