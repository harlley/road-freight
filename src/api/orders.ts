import { config } from "../config";
import { Order } from "../types";

const headers = {
  "Content-Type": "application/json",
};

export const getOrders = async () => {
  const response = await fetch(`${config.apiUrl}/orders`);
  return await response.json();
};

export const postOrders = async (order: Order) => {
  const response = await fetch(`${config.apiUrl}/orders`, {
    method: "POST",
    body: JSON.stringify(order),
    headers,
  });
  return await response.json();
};

export const deleteOrders = async (id: Pick<Order, "id">) => {
  const response = await fetch(`${config.apiUrl}/orders/${id}`, {
    method: "DELETE",
  });
  return response;
};

export const putOrders = async (id: Pick<Order, "id">, order: Order) => {
  const response = await fetch(`${config.apiUrl}/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(order),
    headers,
  });
  return await response.json();
};
