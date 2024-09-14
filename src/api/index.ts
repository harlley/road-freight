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

import { getWarehouses, deleteWarehouses, postWarehouses } from "./warehouses";

export const headers = {
  "Content-Type": "application/json",
};

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
  getWarehouses,
  deleteWarehouses,
  postWarehouses,
};
