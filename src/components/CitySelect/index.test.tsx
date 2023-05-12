import CitySelect from ".";
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../utils/test-utils";

describe("CitySelect", () => {
  const onChange = vi.fn();

  it("should show placeholder text if its prop, value is null", () => {
    render(<CitySelect onChange={onChange} value={null} />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("should show skeleton when the search query gets started", async () => {
    render(<CitySelect onChange={onChange} value={null} />);
    const inputElement = screen.getByRole("combobox");
    await userEvent.click(inputElement);
    await userEvent.keyboard("p");
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("should show city items in async way", async () => {
    render(<CitySelect onChange={onChange} value={null} />);
    const inputElement = screen.getByRole("combobox");
    await userEvent.click(inputElement);
    await userEvent.keyboard("p");

    const loadingSkeleton = screen.getAllByRole("menuitem")[0];
    await waitFor(() => expect(loadingSkeleton).not.toBeInTheDocument());

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("Selecting a city item should call onChange callback", async () => {
    render(<CitySelect onChange={onChange} value={null} />);
    const inputElement = screen.getByRole("combobox");
    await userEvent.click(inputElement);
    await userEvent.keyboard("p");
    expect(screen.getByDisplayValue("p")).toBeInTheDocument();
    const loadingSkeleton = screen.getAllByRole("menuitem")[0];
    await waitFor(() => expect(loadingSkeleton).not.toBeInTheDocument());

    const cityListElement = screen.getAllByRole("option");
    expect(cityListElement).toHaveLength(3);

    const cityListItem = screen.getByText("Paris");
    await userEvent.click(cityListItem);

    expect(onChange).toBeCalledWith(expect.objectContaining({ name: "Paris" }));
  });

  it("should render the city name if value prop is specified", () => {
    const value = {
      name: "Paris",
      latitude: 48.856614,
      longitude: 2.352222,
    };
    render(<CitySelect onChange={onChange} value={value} />);

    expect(screen.getByDisplayValue("Paris")).toBeInTheDocument();
  });

  it("should render clear button if value prop is specified", () => {
    const value = {
      name: "Paris",
      latitude: 48.856614,
      longitude: 2.352222,
    };
    render(<CitySelect onChange={onChange} value={value} />);

    expect(screen.getByDisplayValue("Paris")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeVisible();
  });
});
