import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
              <a href={`/orders`}>Orders</a>
            </li>
            <li>
              <a href={`/vehicles`}>Vehicles</a>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </>
  );
}
