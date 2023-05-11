import { useForm, FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { render, renderHook, screen, userEvent } from "../../utils/test-utils";

import type { CityFormInputs } from "../CityForm";
import CitySelectList from ".";

describe("CitySelectList", () => {
  beforeEach(() => {
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
        <CitySelectList />
      </FormProvider>,
    );
  });

  it("should render two city select and an add button by default", () => {
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getByRole("button")).toHaveTextContent(/Add destination/i);
  });

  it("should be able to add/remove a city select", async () => {
    const btnAdd = screen.getByRole("button");

    await userEvent.click(btnAdd);
    expect(screen.getAllByRole("combobox")).toHaveLength(3);

    const btnRemove = screen.getAllByRole("button")[0];
    await userEvent.click(btnRemove);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });
});
