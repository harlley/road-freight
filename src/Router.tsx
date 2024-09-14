import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  Layout,
  Orders,
  Vehicles,
  Error,
  Assignments,
} from "./components/pages";
import { Warehouses } from "./components/pages/Warehouses";
import { Routes } from "./components/pages/Routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Navigate to="orders" replace />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "vehicles",
        element: <Vehicles />,
      },
      {
        path: "assignments",
        element: <Assignments />,
      },
      {
        path: "warehouses",
        element: <Warehouses />,
      },
      {
        path: "routes",
        element: <Routes />,
      },
    ],
  },
]);
