import styled from "styled-components";
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import { Classes, FormGroup, Intent } from "@blueprintjs/core";
import { useFormContext } from "react-hook-form";

import { CityFormInputs } from "../CityForm";
import { useMemo } from "react";

export function formatDate(date: Date) {
  return format(date, "MM/dd/yyyy");
}

export function parseDate(strDate: string) {
  return parse(strDate, "MM/dd/yyyy", new Date());
}

const DateInputContainer = styled.div`
  display: flex;
  flex: 1;
  .${Classes.INPUT} {
    text-align: center;
  }
`;

export interface DateInputProps {
  value: string | null;
  onChange?: (newDate: string | null, isUserChange: boolean) => void;
  label?: React.ReactNode;
}

function DateInput(props: DateInputProps) {
  const {
    formState: { errors },
  } = useFormContext<CityFormInputs>();

  const errorText = useMemo(() => {
    if (errors.date) {
      if (errors.date.type === "required") {
        return "Field is required.";
      }
      if (errors.date.type === "afterToday") {
        return "Select a future date";
      }
    }
    return undefined;
  }, [errors.date]);

  return (
    <DateInputContainer>
      <FormGroup
        helperText={errorText}
        intent={errors.date ? Intent.DANGER : Intent.NONE}
        label={props.label}
        style={{ alignItems: "flex-start" }}
      >
        <DateInput2
          inputProps={{ intent: errors.date ? Intent.DANGER : Intent.NONE }}
          formatDate={formatDate}
          onChange={props.onChange}
          parseDate={parseDate}
          placeholder="MM/dd/yyyy"
          timePickerProps={undefined}
          value={props.value}
        />
      </FormGroup>
    </DateInputContainer>
  );
}

export default DateInput;
