import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import DefaultLayout from "./layouts/Default";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import SearchResultsPage from "./pages/SearchResults";

export const router = createBrowserRouter([
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
