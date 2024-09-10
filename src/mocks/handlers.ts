import { ordersHandler } from "./ordersHandler";
import { vehiclesHandler } from "./vehiclesHandler";

export const handlers = [...ordersHandler, ...vehiclesHandler];
