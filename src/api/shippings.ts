import { headers } from ".";
import { config } from "../config";

export const patchShippingsSort = async (orders: string[], sorts: number[]) => {
  const response = await fetch(`${config.apiUrl}/shippings`, {
    method: "PATCH",
    body: JSON.stringify({ orders, sorts }),
    headers,
  });
  return await response.json();
};
