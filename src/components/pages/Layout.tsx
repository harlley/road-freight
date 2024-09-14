import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Outlet, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemText,
  Link,
  CssBaseline,
  Box,
  ListItemButton,
} from "@mui/material";
import styles from "./pages.module.css";

export function Layout() {
  const location = useLocation();

  return (
    <>
      <CssBaseline />
      <Drawer variant="permanent">
        <List className={styles.menu}>
          <ListItemButton
            component={Link}
            href="/warehouses"
            selected={location.pathname === "/warehouses"}
          >
            <ListItemText primary="Warehouses" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/vehicles"
            selected={location.pathname === "/vehicles"}
          >
            <ListItemText primary="Vehicles" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/orders"
            selected={location.pathname === "/orders"}
          >
            <ListItemText primary="Orders" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/assignments"
            selected={location.pathname === "/assignments"}
          >
            <ListItemText primary="Assignments" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/routes"
            selected={location.pathname === "/routes"}
          >
            <ListItemText primary="Routes" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box component="main" className={styles.main}>
        <Outlet />
      </Box>
    </>
  );
}
