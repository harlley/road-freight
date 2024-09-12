import {
  getOrders,
  postOrders,
  putOrders,
  deleteOrders,
  patchOrdersUnsignVehicle,
} from "./orders";
import {
  getVehicles,
  postVehicles,
  putVehicles,
  deleteVehicles,
  postShipping,
} from "./vehicles";

export const api = {
  getOrders,
  postOrders,
  putOrders,
  deleteOrders,
  getVehicles,
  postVehicles,
  putVehicles,
  deleteVehicles,
  postShipping,
  patchOrdersUnsignVehicle,
};
