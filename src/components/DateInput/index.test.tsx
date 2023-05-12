import { FormProvider, useForm } from "react-hook-form";
import { format } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import { render, renderHook, screen, userEvent } from "../../utils/test-utils";

import type { CityFormInputs } from "../CityForm";
import type { DateInputProps } from ".";
import DateInput from ".";

function renderDateInput(props: DateInputProps) {
  const { result } = renderHook(() =>
    useForm<CityFormInputs>({
      defaultValues: {
        cities: [{}, {}],
        passengers: "1",
        date: format(new Date(), "yyyy-MM-dd"),
      },
      mode: "onChange",
    }),
  );

  render(
    <FormProvider {...result.current}>
      <DateInput {...props} />
    </FormProvider>,
  );
}

describe("DateInput", () => {
  it("should render an input with MM/dd/yyyy placeholder", () => {
    renderDateInput({ value: null });
    expect(screen.getByPlaceholderText("MM/dd/yyyy")).toBeInTheDocument();
  });

  it("should render value with the format, `MM/dd/yyyy`", () => {
    const expectedDate = format(new Date(), "MM/dd/yyyy");
    renderDateInput({ value: format(new Date(), "yyyy-MM-dd") });

    expect(screen.getByDisplayValue(expectedDate)).toBeInTheDocument();
  });

  it("should call onChange callback when changing the date", async () => {
    const onChange = vi.fn();
    renderDateInput({ value: "2023/05/12", onChange });

    const dateInput = screen.getByPlaceholderText("MM/dd/yyyy");
    await userEvent.click(dateInput);

    const nextDateElement = screen.getByLabelText(/Wed May 10 2023/i);
    await userEvent.click(nextDateElement);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe("2023-05-10");
  });
});
