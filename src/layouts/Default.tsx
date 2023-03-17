import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default DefaultLayout;
