import { Outlet } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

export function Layout() {
  return (
    <>
      <Button variant="contained" startIcon={<SaveIcon />}>
        Save
      </Button>
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
