import { Classes, Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import styled from "styled-components";

const StyledMenuItem2 = styled(MenuItem2)`
  margin-bottom: 1em;
`;

function Skeleton() {
  return (
    <Menu>
      <StyledMenuItem2 className={Classes.SKELETON} text="City" />
      <StyledMenuItem2 className={Classes.SKELETON} text="City" />
      <StyledMenuItem2 className={Classes.SKELETON} text="City" />
    </Menu>
  );
}

export default Skeleton;
