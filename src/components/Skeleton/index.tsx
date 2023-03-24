import { Classes, Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import styled from "styled-components";

const StyledMenuItem2 = styled(MenuItem2)`
  margin-bottom: 1em;
`;

function Skeleton() {
  return (
    <Menu>
      <StyledMenuItem2 text="City" className={Classes.SKELETON} />
      <StyledMenuItem2 text="City" className={Classes.SKELETON} />
      <StyledMenuItem2 text="City" className={Classes.SKELETON} />
    </Menu>
  );
}

export default Skeleton;
