import dayjs from "dayjs";
import { headers } from ".";
import { config } from "../config";
import { Shipping, Vehicle } from "../types";

export const getVehicles = async () => {
  const response = await fetch(`${config.apiUrl}/vehicles`);
  return await response.json();
};

export const postVehicles = async (vehicle: Vehicle) => {
  const response = await fetch(`${config.apiUrl}/vehicles`, {
    method: "POST",
    body: JSON.stringify(vehicle),
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

export const deleteVehicles = async (id: Pick<Vehicle, "id">) => {
  const response = await fetch(`${config.apiUrl}/vehicles/${id}`, {
    method: "DELETE",
  });
  return response;
};

export const putVehicles = async (
  id: Pick<Vehicle, "id">,
  vehicle: Vehicle,
) => {
  const response = await fetch(`${config.apiUrl}/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(vehicle),
    headers,
  });
  return await response.json();
};

export const postShipping = async (shipping: Shipping) => {
  const response = await fetch(
    `${config.apiUrl}/vehicles/${shipping.vehicleId}/orders`,
    {
      method: "POST",
      body: JSON.stringify(shipping),
      headers,
    },
  );
  return await response.json();
};

export const getVehiclesOrders = async (
  id: Pick<Vehicle, "id">,
  date: string,
) => {
  const dateFormatted = dayjs(date).format("YYYY-MM-DD");
  const response = await fetch(
    `${config.apiUrl}/vehicles/${id}/orders?date=${dateFormatted}`,
  );
  return await response.json();
};
