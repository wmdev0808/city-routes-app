import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <h1>Oops! {error.status}</h1>
        <p>{error.statusText}</p>
        <p>
          <i>{error.data}</i>
        </p>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <main>
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </main>
    );
  }
  return null;
}

export default ErrorPage;
