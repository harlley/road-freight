import { ordersHandler } from "./ordersHandler";
import { vehiclesHandler } from "./vehiclesHandler";
import { warehousesHandler } from "./warehousesHandler";
import { shippingsHandler } from "./shippingsHandler";

export const handlers = [
  ...ordersHandler,
  ...vehiclesHandler,
  ...warehousesHandler,
  ...shippingsHandler,
];
