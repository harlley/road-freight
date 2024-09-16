import { headers } from ".";
import { config } from "../config";
import { Warehouse } from "../types";

export const getWarehouses = async () => {
  const response = await fetch(`${config.apiUrl}/warehouses`);
  return await response.json();
};

export const postWarehouses = async (warehouse: Warehouse) => {
  const response = await fetch(`${config.apiUrl}/warehouses`, {
    method: "POST",
    body: JSON.stringify(warehouse),
    headers,
  });

  if (response.status >= 500) {
    throw new Error(
      `Server error: ${response.status} - ${await response.text()}`,
    );
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
};

export const deleteWarehouses = async (id: Pick<Warehouse, "id">) => {
  const response = await fetch(`${config.apiUrl}/warehouses/${id}`, {
    method: "DELETE",
  });
  return response;
};
