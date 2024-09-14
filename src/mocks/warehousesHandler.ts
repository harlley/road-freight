import { http, HttpResponse } from "msw";
import { config } from "../config";
import { Warehouse } from "../types";

export const warehousesHandler = [
  http.post(`${config.apiUrl}/warehouses`, async ({ request }) => {
    const warehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");
    const newWarehouse = (await request.json()) as Warehouse;
    if (
      warehouses.find(
        (warehouse: Warehouse) => warehouse.name === newWarehouse.name
      )
    ) {
      return HttpResponse.json(
        { message: "Warehouse with the same name already exists" },
        { status: 400 }
      );
    }
    warehouses.push({ id: window.crypto.randomUUID(), ...newWarehouse });
    localStorage.setItem("warehouses", JSON.stringify(warehouses));
    return HttpResponse.json(newWarehouse, { status: 201 });
  }),

  http.get(`${config.apiUrl}/warehouses`, async () => {
    const warehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");
    return HttpResponse.json(warehouses);
  }),

  http.delete(`${config.apiUrl}/warehouses/:id`, async ({ params }) => {
    const warehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");
    const index = warehouses.findIndex(
      (warehouse: Warehouse) => warehouse.id === params.id
    );

    if (index !== -1) {
      warehouses.splice(index, 1);
      localStorage.setItem("warehouses", JSON.stringify(warehouses));
      return HttpResponse.json(undefined, { status: 204 });
    }

    return HttpResponse.json(
      { message: "Warehouse not found" },
      { status: 404 }
    );
  }),
];
