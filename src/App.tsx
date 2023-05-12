import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import DefaultLayout from "./layouts/Default";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import SearchResultsPage from "./pages/SearchResults";

export const routes: RouteObject[] = [
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

export const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
