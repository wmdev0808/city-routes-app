import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem;
  border-radius: 1rem;
  background-color: white;
  font-family: "Inter";
  font-weight: 500;
  @media (min-width: 768px) {
    width: 734px;
    padding: 5rem;
  }
`;

export default PageContainer;
