import { config } from "../config";
import { Order } from "../types";

const headers = {
  "Content-Type": "application/json",
};

export const postOrders = async (order: Order) => {
  const response = await fetch(`${config.apiUrl}/orders`, {
    method: "POST",
    body: JSON.stringify(order),
    headers,
  });
  return await response.json();
};

export const deleteOrders = async (
  invoiceNumber: Pick<Order, "invoiceNumber">
) => {
  const response = await fetch(`${config.apiUrl}/orders/${invoiceNumber}`, {
    method: "DELETE",
  });
  return response;
};

export const putOrders = async (
  invoiceNumber: Pick<Order, "invoiceNumber">,
  order: Order
) => {
  const response = await fetch(`${config.apiUrl}/orders/${invoiceNumber}`, {
    method: "PUT",
    body: JSON.stringify(order),
    headers,
  });
  return await response.json();
};
