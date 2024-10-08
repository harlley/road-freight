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
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "./pages.module.css";
import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ContextType {
  setMessage: Dispatch<SetStateAction<string>>;
}

export const ContextLayout = createContext<ContextType>({
  setMessage: () => {},
});

export function Layout() {
  const location = useLocation();
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setMessage("");
  };

  return (
    <ContextLayout.Provider value={{ setMessage }}>
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert severity="error" variant="filled">
          {message}
        </Alert>
      </Snackbar>
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
    </ContextLayout.Provider>
  );
}
