import { FormProvider, useForm } from "react-hook-form";
import { format } from "date-fns";
import { render, renderHook, screen, userEvent } from "../../utils/test-utils";

import type { CityFormInputs } from "../CityForm";
import type { IntegerInputProps } from ".";
import IntegerInput from ".";

function renderIntegerInput(props: IntegerInputProps) {
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
      <IntegerInput {...props} />
    </FormProvider>,
  );
}

describe("IntegerInput", () => {
  it("should render input value, increase/decrease buttons", async () => {
    const inputProps = { onChange: vi.fn(), value: 1 };
    renderIntegerInput(inputProps);

    const inputElement = screen.getByDisplayValue("1");
    const btnDecrement = screen.getByLabelText("decrement");
    const btnIncrement = screen.getByLabelText("increment");

    expect(inputElement).toBeInTheDocument();
    expect(btnDecrement).toBeInTheDocument();
    expect(btnIncrement).toBeInTheDocument();

    await userEvent.click(btnIncrement);
    expect(inputProps.onChange).toBeCalledTimes(1);
    expect(inputProps.onChange.mock.calls[0][0]).toBe("2");

    await userEvent.click(btnDecrement);
    expect(inputProps.onChange).toBeCalledTimes(2);
    expect(inputProps.onChange.mock.calls[1][0]).toBe("0");
  });
});
