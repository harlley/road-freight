import { http, HttpResponse } from "msw";
import { config } from "../config";
import { Shipping, Vehicle } from "../types";

export const vehiclesHandler = [
  http.post(`${config.apiUrl}/vehicles`, async ({ request }) => {
    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const newVehicle = (await request.json()) as Vehicle;
    if (
      vehicles.find(
        (vehicle: Vehicle) => vehicle.numberPlate === newVehicle.numberPlate
      )
    ) {
      return HttpResponse.json(
        { message: "Vehicle with the same number plate already exists" },
        { status: 400 }
      );
    }
    vehicles.push({ id: window.crypto.randomUUID(), ...newVehicle });
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    return HttpResponse.json(newVehicle, { status: 201 });
  }),

  http.get(`${config.apiUrl}/vehicles`, async () => {
    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    return HttpResponse.json(vehicles);
  }),

  http.delete(`${config.apiUrl}/vehicles/:id`, async ({ params }) => {
    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const index = vehicles.findIndex(
      (vehicle: Vehicle) => vehicle.id === params.id
    );

    if (index !== -1) {
      vehicles.splice(index, 1);
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
      return HttpResponse.json(undefined, { status: 204 });
    }

    return HttpResponse.json({ message: "Vehicle not found" }, { status: 404 });
  }),

  http.put(`${config.apiUrl}/vehicles/:id`, async ({ params, request }) => {
    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const index = vehicles.findIndex(
      (vehicle: Vehicle) => vehicle.id === params.id
    );

    if (index !== -1) {
      const updatedVehicle = (await request.json()) as Vehicle;
      vehicles[index] = updatedVehicle;
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
      return HttpResponse.json(updatedVehicle, { status: 200 });
    }

    return HttpResponse.json({ message: "Vehicle not found" }, { status: 404 });
  }),

  http.post(`${config.apiUrl}/vehicles/:id/orders`, async ({ request }) => {
    const shipping = JSON.parse(localStorage.getItem("shipping") || "[]");
    const newShipping = (await request.json()) as Shipping;
    shipping.push({ id: window.crypto.randomUUID(), ...newShipping });
    localStorage.setItem("shipping", JSON.stringify(shipping));
    return HttpResponse.json(shipping, { status: 201 });
  }),
];
