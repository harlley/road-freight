import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  Layout,
  Orders,
  Vehicles,
  Error,
  Assignments,
} from "./components/pages";

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
    ],
  },
]);
