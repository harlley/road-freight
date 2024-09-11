import { config } from "../config";
import { Vehicle } from "../types";

const headers = {
  "Content-Type": "application/json",
};

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
  vehicle: Vehicle
) => {
  const response = await fetch(`${config.apiUrl}/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(vehicle),
    headers,
  });
  return await response.json();
};
