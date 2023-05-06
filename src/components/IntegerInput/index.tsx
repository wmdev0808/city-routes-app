import {
  Button,
  Classes,
  FormGroup,
  Intent,
  NumericInput,
  Utils,
} from "@blueprintjs/core";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";
import { parseInteger } from "../../utils/parse";
import type { CityFormInputs } from "../CityForm";
import { useMemo } from "react";

const IntegerInputContainer = styled.div`
  display: flex;
  flex: 1;
  .${Classes.INPUT} {
    text-align: center;
  }
`;

enum IncredmentDirection {
  DOWN = -1,
  UP = +1,
}

export interface IntegerInputProps {
  onChange: (value: string) => void;
  value: number | string;
  max?: number;
  min?: number;
  label?: React.ReactNode;
}

function IntegerInput(props: IntegerInputProps) {
  const {
    formState: { errors },
  } = useFormContext<CityFormInputs>();

  function renderButton(isLeft: boolean, value: number | string) {
    if (isLeft) {
      return (
        <Button
          aria-controls={Utils.uniqueId("integerInput")}
          aria-label="decrement"
          disabled={value == props.min}
          icon="minus"
          onClick={handleButtonClick(IncredmentDirection.DOWN)}
        />
      );
    }

    return (
      <Button
        aria-controls={Utils.uniqueId("integerInput")}
        aria-label="increment"
        disabled={value == props.max}
        icon="plus"
        onClick={handleButtonClick(IncredmentDirection.UP)}
      />
    );
  }

  function handleButtonClick(direction: IncredmentDirection) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const [, strVal] = parseInteger(
        +props.value + direction,
        props.min,
        props.max,
      );

      props.onChange(strVal);
    };
  }

  function handleValueChange(
    _numVal: number,
    strVal: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputElement: HTMLInputElement | null,
  ) {
    const [, normalizedStrVal] = parseInteger(strVal, props.min, props.max);

    if (props.onChange) {
      props.onChange(normalizedStrVal);
    }
  }

  const errorText = useMemo(() => {
    if (errors.passengers) {
      if (errors.passengers.type === "required") {
        return "Field is required.";
      }
      if (errors.passengers.type === "greaterThanZero") {
        return "Select passengers";
      }
    }
    return undefined;
  }, [errors.passengers]);

  return (
    <IntegerInputContainer>
      <FormGroup
        helperText={errorText}
        intent={errors.passengers ? Intent.DANGER : Intent.NONE}
        label={props.label}
        style={{ alignItems: "flex-start" }}
      >
        <NumericInput
          buttonPosition="none"
          fill
          intent={errors.passengers ? Intent.DANGER : Intent.NONE}
          leftElement={renderButton(true, props.value)}
          max={props.max}
          min={props.min}
          onValueChange={handleValueChange}
          rightElement={renderButton(false, props.value)}
          value={props.value}
        />
      </FormGroup>
    </IntegerInputContainer>
  );
}

export default IntegerInput;
