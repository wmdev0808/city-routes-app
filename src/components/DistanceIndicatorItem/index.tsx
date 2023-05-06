import { Icon, IconSize } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import styled from "styled-components";
import type { Distance } from "../../api/cities";

const ItemContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  .dots {
    display: flex;
    flex-direction: column;
  }
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 3fr;
  grid-template-rows: 1fr;
  column-gap: 1rem;

  .second {
    grid-column: 2 / 3;
    justify-self: center;
  }
  .city-name {
    grid-column: 3 / 4;
    justify-self: start;
  }
`;

interface DistanceIndicatorItemProps {
  item: Distance;
  isFirst?: boolean;
  isLast?: boolean;
}

function DistanceIndicatorItem(props: DistanceIndicatorItemProps) {
  return (
    <ItemContainer>
      {props.isFirst && (
        <ItemRow>
          <Icon className="second" icon="circle" />
          <div className="city-name">{props.item.origin.name}</div>
        </ItemRow>
      )}

      <ItemRow>
        <div className="second">
          <Popover2
            content={
              <span style={{ color: "#7786d2", fontWeight: 500 }}>
                {props.item.distance} km
              </span>
            }
            isOpen
            placement="left"
            popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
          >
            <div className="dots">
              <Icon icon="dot" />
              <Icon icon="dot" />
              <Icon icon="dot" />
            </div>
          </Popover2>
        </div>
      </ItemRow>

      <ItemRow>
        {props.isLast ? (
          <Icon
            className="second"
            color="red"
            icon="map-marker"
            size={IconSize.LARGE}
          />
        ) : (
          <Icon className="second" icon="circle" />
        )}
        <div className="city-name">{props.item.destination.name}</div>
      </ItemRow>
    </ItemContainer>
  );
}

export default DistanceIndicatorItem;
