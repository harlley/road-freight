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

export const deleteVehicles = async (
  numberPlate: Pick<Vehicle, "numberPlate">
) => {
  const response = await fetch(`${config.apiUrl}/vehicles/${numberPlate}`, {
    method: "DELETE",
  });
  return response;
};

export const putVehicles = async (
  numberPlate: Pick<Vehicle, "numberPlate">,
  vehicle: Vehicle
) => {
  const response = await fetch(`${config.apiUrl}/vehicles/${numberPlate}`, {
    method: "PUT",
    body: JSON.stringify(vehicle),
    headers,
  });
  return await response.json();
};
