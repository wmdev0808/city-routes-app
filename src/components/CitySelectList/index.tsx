import { useEffect, useReducer } from "react";

import { Button, Classes, FormGroup, Utils } from "@blueprintjs/core";
import styled from "styled-components";

import { City } from "../../api/cities";
import CitySelect from "../CitySelect";

interface CitySelectListState {
  value: CityField[];
}

interface CityField {
  id: string;
  value: City | null;
}

enum CitySelectListActionTypes {
  ADD_CITY = "ADD_CITY",
  REMOVE_CITY = "REMOVE_CITY",
  UPDATE_CITY = "UPDATE_CITY",
}

interface CitySelectListAction {
  type: keyof typeof CitySelectListActionTypes;
  payload?: CityField | string;
}

interface CitySelectListProps {
  value?: City[];
  onChange?: (value: City[]) => void;
}

const CitySelectListContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  .btn-add-destination {
    width: fit-content;
  }
  .${Classes.FORM_CONTENT} {
    width: 100%;
  }
`;

const CitySelectItemWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  .btn-remove-destination {
    margin-left: 2rem;
    &.hidden {
      visibility: hidden;
    }
  }
`;

function AddDestinationButton({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Button
      className="btn-add-destination"
      icon="add"
      minimal
      onClick={onClick}
      text="Add destination"
    />
  );
}

function RemoveDestinationButton({
  onClick,
  hidden,
}: {
  hidden: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Button
      icon="delete"
      minimal
      onClick={onClick}
      className={`btn-remove-destination ${hidden ? "hidden" : ""}`}
    />
  );
}

function CitySelectList(props: CitySelectListProps) {
  const [citiesState, dispatch] = useReducer(
    citySelectListStateReducer,
    getInitialState()
  );

  useEffect(() => {
    if (props.onChange) {
      const selectedCities = citiesState.value
        .filter((cityField) => cityField.value)
        .map((cityField) => cityField.value);
      props.onChange(selectedCities as City[]);
    }
  }, [citiesState]);

  function citySelectListStateReducer(
    state: CitySelectListState,
    action: CitySelectListAction
  ): CitySelectListState {
    if (action.type === CitySelectListActionTypes.ADD_CITY) {
      return {
        ...state,
        value: [
          ...state.value,
          { id: Utils.uniqueId("city-field"), value: null },
        ],
      };
    }

    if (action.type === CitySelectListActionTypes.REMOVE_CITY) {
      const updatedCityFields = state.value.filter(
        (cityField) => cityField.id !== action.payload
      );
      return { ...state, value: updatedCityFields };
    }

    if (action.type === CitySelectListActionTypes.UPDATE_CITY) {
      const payload = action.payload as CityField;

      const updatedIndex = state.value.findIndex(
        (cityField) => cityField.id === payload.id
      );

      const updatedCityFields = [...state.value];
      updatedCityFields[updatedIndex] = payload;

      return { ...state, value: updatedCityFields };
    }

    return getInitialState();
  }

  function getInitialState(): CitySelectListState {
    if (props.value && props.value.length > 1) {
      const cityFields = props.value.map((city) => ({
        id: Utils.uniqueId("city-field"),
        value: city,
      }));

      return { value: cityFields };
    }

    return {
      value: [
        { id: Utils.uniqueId("city-field"), value: null },
        { id: Utils.uniqueId("city-field"), value: null },
      ],
    };
  }

  function handleRemoveCityField(
    id: string
  ): React.MouseEventHandler<HTMLElement> {
    return () => {
      dispatch({ type: CitySelectListActionTypes.REMOVE_CITY, payload: id });
    };
  }

  function handleAddCityField() {
    dispatch({ type: CitySelectListActionTypes.ADD_CITY });
  }

  function handleUpdateCityField(id: string) {
    return (city: City | null) => {
      dispatch({
        type: CitySelectListActionTypes.UPDATE_CITY,
        payload: { id, value: city },
      });
    };
  }

  return (
    <CitySelectListContainer>
      {citiesState.value.map((cityField, index) => {
        const label = index === 0 ? "City of origin" : "City of destination";
        const isHiddenRemoveButton =
          index === 0 || citiesState.value.length == 2;

        return (
          <FormGroup
            key={cityField.id}
            label={label}
            style={{ alignItems: "flex-start" }}
          >
            <CitySelectItemWrapper>
              <CitySelect
                value={cityField.value}
                onChange={handleUpdateCityField(cityField.id)}
              />
              <RemoveDestinationButton
                hidden={isHiddenRemoveButton}
                onClick={handleRemoveCityField(cityField.id)}
              />
            </CitySelectItemWrapper>
          </FormGroup>
        );
      })}
      <AddDestinationButton onClick={handleAddCityField} />
    </CitySelectListContainer>
  );
}

export default CitySelectList;
