import { RouterProvider, createMemoryRouter } from "react-router-dom";
import DefaultLayout from "./layouts/Default";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import SearchResultsPage from "./pages/SearchResults";
import { render, screen, waitFor } from "./utils/test-utils";

const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "search-results",
        element: <SearchResultsPage />,
      },
    ],
  },
];

describe("App", () => {
  it("should render homepage", async () => {
    const homepageRoute = "/";

    // use createMemoryRouter when you want to manually control the history
    const router = createMemoryRouter(routes, {
      initialEntries: [homepageRoute],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => screen.getByRole("main"));
    expect(screen.getByRole("main")).toHaveTextContent("City of origin");
    expect(screen.getByRole("main")).toHaveTextContent("City of destination");
    expect(screen.getByRole("main")).toHaveTextContent("Passengers");
    expect(screen.getByRole("main")).toHaveTextContent("Date");
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("should render search results page", async () => {
    const searchResultsRoute = "/search-results";

    // use createMemoryRouter when you want to manually control the history
    const router = createMemoryRouter(routes, {
      initialEntries: [searchResultsRoute],
    });

    render(<RouterProvider router={router} />);

    // wait for api call to be finshed
    const loadingIndicator = await screen.findByRole("progressbar");
    await waitFor(() => expect(loadingIndicator).not.toBeInTheDocument());

    expect(screen.getByRole("main")).toHaveTextContent("is total distance");
    expect(screen.getByRole("main")).toHaveTextContent("passengers");
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("should render route error page", async () => {
    const badRoute = "/some/bad/route";

    // use createMemoryRouter when you want to manually control the history
    const router = createMemoryRouter(routes, { initialEntries: [badRoute] });

    render(<RouterProvider router={router} />);

    await waitFor(() => screen.getByRole("heading"));
    expect(screen.getByRole("heading")).toHaveTextContent("Oops! 404");
  });
});
