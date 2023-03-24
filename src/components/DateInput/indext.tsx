import styled from "styled-components";
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";

const DateInputContainer = styled.div`
  display: flex;
  flex: 1;
`;

export interface DateInputProps {
  value: string | null;
  onChange?: (newDate: string | null, isUserChange: boolean) => void;
}

function DateInput(props: DateInputProps) {
  function formatDate(date: Date) {
    return format(date, "MM/dd/yyyy");
  }

  function parseDate(strDate: string) {
    return parse(strDate, "MM/dd/yyyy", new Date());
  }

  return (
    <DateInputContainer>
      <DateInput2
        formatDate={formatDate}
        onChange={props.onChange}
        parseDate={parseDate}
        placeholder="MM/dd/yyyy"
        timePickerProps={undefined}
        value={props.value}
      />
    </DateInputContainer>
  );
}

export default DateInput;
