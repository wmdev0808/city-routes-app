import { useMemo } from "react";
import { Button, Classes, FormGroup, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import {
  Controller,
  FieldError,
  FieldPath,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import { City } from "../../api/cities";
import CitySelect from "../CitySelect";
import { CityFormInputs } from "../CityForm";

/**
 * Validation
 */

// Check emptiness
function checkEmptiness(value: City | null) {
  return Boolean(value) && Object.keys(value!).length > 0;
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
    margin-right: 2rem;
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

function CitySelectList() {
  const {
    clearErrors,
    control,
    formState: { errors },
    setError,
  } = useFormContext<CityFormInputs>();
  const { fields, append, remove } = useFieldArray({ control, name: "cities" });

  const errorTexts = useMemo(() => {
    if (errors.cities) {
      return (errors.cities as (FieldError | null)[]).map(
        (cityError, index) => {
          if (cityError === null) return undefined;
          if (cityError.type === "notEmpty") {
            if (index === 0) {
              return "You must choose the city of origin";
            }
            return "You must choose the city of destination";
          }
          if (cityError.type === "apiError") {
            return cityError.message;
          }
        },
      );
    }

    return fields.map(() => undefined);
  }, [JSON.stringify(errors.cities)]);

  function handleFieldApiError(field: FieldPath<CityFormInputs>) {
    return (error: Error) => {
      setError(field, { type: "apiError", message: error.message });
    };
  }

  function handleAddCityField() {
    append({} as City);
  }

  function handleRemoveCityField(index: number) {
    return () => remove(index);
  }

  return (
    <CitySelectListContainer>
      {fields.map((field, index) => {
        const label = index === 0 ? "City of origin" : "City of destination";
        const isHiddenRemoveButton = index === 0 || fields.length == 2;
        const cityErrors = errors.cities as (FieldError | null)[];
        const intent =
          cityErrors && cityErrors[index] ? Intent.DANGER : Intent.NONE;

        return (
          <FormGroup
            helperText={errorTexts[index]}
            intent={intent}
            key={field.id}
            label={label}
            style={{ alignItems: "flex-start" }}
          >
            <CitySelectItemWrapper>
              <Controller
                control={control}
                name={`cities.${index}`}
                render={({ field: { onChange, value } }) => (
                  <CitySelect
                    intent={intent}
                    onChange={onChange}
                    onError={handleFieldApiError(`cities.${index}`)}
                    value={value}
                  />
                )}
                rules={{
                  validate: { notEmpty: checkEmptiness },
                }}
              />

              <RemoveDestinationButton
                hidden={isHiddenRemoveButton}
                onClick={handleRemoveCityField(index)}
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
