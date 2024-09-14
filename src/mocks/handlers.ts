import { ordersHandler } from "./ordersHandler";
import { vehiclesHandler } from "./vehiclesHandler";
import { warehousesHandler } from "./warehousesHandler";

export const handlers = [
  ...ordersHandler,
  ...vehiclesHandler,
  ...warehousesHandler,
];
