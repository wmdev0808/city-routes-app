import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <main>
      <h1>An error occurred!</h1>
      <p>{error.message}</p>
    </main>
  );
}

export default ErrorPage;
