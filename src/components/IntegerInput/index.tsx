import { Button, Classes, NumericInput, Utils } from "@blueprintjs/core";
import styled from "styled-components";
import { parseInteger } from "../../utils/parse";

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
  onValueChange: (
    _v: number,
    value: string,
    inputElement: HTMLInputElement | null
  ) => void;
  value: number | string;
  max?: number;
  min?: number;
}

function IntegerInput(props: IntegerInputProps) {
  function renderButton(isLeft: boolean, value: number | string) {
    if (isLeft) {
      return (
        <Button
          aria-label="decrement"
          aria-controls={Utils.uniqueId("integerInput")}
          disabled={value == props.min}
          icon="minus"
          onClick={handleButtonClick(IncredmentDirection.DOWN)}
        />
      );
    }

    return (
      <Button
        aria-label="increment"
        aria-controls={Utils.uniqueId("integerInput")}
        disabled={value == props.max}
        icon="plus"
        onClick={handleButtonClick(IncredmentDirection.UP)}
      />
    );
  }

  function handleButtonClick(direction: IncredmentDirection) {
    return (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const [numVal, strVal] = parseInteger(
        +props.value + direction,
        props.min,
        props.max
      );

      props.onValueChange(numVal, strVal, null);
    };
  }

  function handleValueChange(
    _numVal: number,
    strVal: string,
    inputElement: HTMLInputElement | null
  ) {
    const [normalizedNumVal, normalizedStrVal] = parseInteger(
      strVal,
      props.min,
      props.max
    );

    if (props.onValueChange) {
      props.onValueChange(normalizedNumVal, normalizedStrVal, inputElement);
    }
  }

  return (
    <IntegerInputContainer>
      <NumericInput
        buttonPosition="none"
        leftElement={renderButton(true, props.value)}
        max={props.max}
        min={props.min}
        onValueChange={handleValueChange}
        rightElement={renderButton(false, props.value)}
        value={props.value}
      />
    </IntegerInputContainer>
  );
}

export default IntegerInput;
