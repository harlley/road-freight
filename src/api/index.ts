export const headers = {
  "Content-Type": "application/json",
};

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
  getVehiclesOrders,
} from "./vehicles";

import { patchShippingsSort } from "./shippings";

import { getWarehouses, deleteWarehouses, postWarehouses } from "./warehouses";

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
  getVehiclesOrders,
  patchShippingsSort,
};
