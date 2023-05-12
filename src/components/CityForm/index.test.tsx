import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { format } from "date-fns";
import { fireEvent, render, screen, userEvent } from "../../utils/test-utils";

import type { CityFormProps } from ".";
import CityForm from ".";
import { routes } from "../../App";

function renderCityForm(props: CityFormProps, query = "") {
  const router = createMemoryRouter(routes, {
    initialEntries: [`/${query}`],
  });

  render(<CityForm {...props} />, {
    wrapper: () => <RouterProvider router={router} />,
  });
}

describe("CityForm", () => {
  it("City select: should check emptyness", async () => {
    const queryString = `?cities=%5B%7B"name"%3A"Paris"%2C"latitude"%3A48.856614%2C"longitude"%3A2.352222%7D%2C%7B"name"%3A"Montpellier"%2C"latitude"%3A43.610769%2C"longitude"%3A3.876716%7D%5D`;
    const cityFormProps: CityFormProps = {
      cities: [
        {
          name: "Paris",
          latitude: 48.856614,
          longitude: 2.352222,
        },
        {
          name: "Montpellier",
          latitude: 43.610769,
          longitude: 3.876716,
        },
      ],
    };

    renderCityForm(cityFormProps, queryString);

    const btnCityDelete = screen.getAllByRole("button")[0];
    await userEvent.click(btnCityDelete);

    expect(
      screen.getByText("You must choose the city of origin"),
    ).toBeInTheDocument();
  });

  it("City select: should check error input, `fail`", async () => {
    renderCityForm({});

    const cityOfOriginInput = screen.getAllByRole("combobox")[0];
    cityOfOriginInput.focus();
    fireEvent.change(cityOfOriginInput, { target: { value: "fail" } });

    expect(
      await screen.findByText("Oops! Failed to search with this keyword."),
    ).toBeInTheDocument();

    const buttons = await screen.findAllByRole("button");
    const btnSubmit = buttons[buttons.length - 1];

    expect(btnSubmit).toHaveAttribute("disabled");
  });

  it("CityForm: should render an error message if Passenger field value is 0", async () => {
    renderCityForm({});

    const btnDecrement = screen.getByLabelText("decrement");
    await userEvent.click(btnDecrement);

    expect(screen.getByText(/Select passengers/i)).toBeInTheDocument();
  });

  it("CityForm: should render an error message if Date field value is less than today", async () => {
    renderCityForm({});

    const dateInput = screen.getByPlaceholderText("MM/dd/yyyy");

    await userEvent.click(dateInput);
    const prevMonthSelector = screen.getByLabelText(/Go to previous month/i);
    await userEvent.click(prevMonthSelector);

    expect(
      await screen.findByText(/Select a future date/i),
    ).toBeInTheDocument();
  });

  it("CityForm: Submit button should be enabled in case of no errors", async () => {
    const cityFormProps: CityFormProps = {
      cities: [
        {
          name: "Paris",
          latitude: 48.856614,
          longitude: 2.352222,
        },
        {
          name: "Montpellier",
          latitude: 43.610769,
          longitude: 3.876716,
        },
      ],
    };

    renderCityForm(cityFormProps);

    const buttons = await screen.findAllByRole("button");
    const btnSubmit = buttons[buttons.length - 1];

    expect(btnSubmit).toHaveAttribute("disabled", "");
  });
});
