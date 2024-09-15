import { http, HttpResponse } from "msw";
import { config } from "../config";
import { Order, Shipping, Vehicle } from "../types";

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
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const shipping = JSON.parse(localStorage.getItem("shipping") || "[]");

    const vehiclesWithShipping = vehicles.map((vehicle: Vehicle) => {
      const shippingData = shipping.filter(
        (shipping: Shipping) => shipping.vehicleId === vehicle.id
      );
      const ordersWithShipping: Order[] = orders.filter((order: Order) =>
        shippingData.map((s: Shipping) => s.orderId).includes(order.id)
      );
      const totalVehicleWeight = ordersWithShipping.reduce(
        (acc, order) => acc + Number(order.weight),
        0
      );
      return {
        ...vehicle,
        availability: ordersWithShipping
          ? vehicle.weightCapacity - totalVehicleWeight
          : vehicle.weightCapacity,
      };
    });

    return HttpResponse.json(vehiclesWithShipping);
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

  http.get(
    `${config.apiUrl}/vehicles/:id/orders`,
    async ({ request, params }) => {
      const url = new URL(request.url);
      const date = url.searchParams.get("date");
      const shipping = JSON.parse(localStorage.getItem("shipping") || "[]");
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const vehicle = JSON.parse(localStorage.getItem("vehicles") || "[]").find(
        (vehicle: Vehicle) => vehicle.id === params.id
      );
      const ordersIds = shipping
        .filter((s: Shipping) => s.vehicleId === params.id && s.date === date)
        .map((s: Shipping) => s.orderId);
      console.log("date", date);
      console.log("ordersIds", ordersIds);
      console.log("shipping", shipping);
      return HttpResponse.json(
        orders
          .filter((order: Order) => ordersIds.includes(order.id))
          .map((order: Order) => ({
            ...order,
            assigned: vehicle?.numberPlate,
          }))
      );
    }
  ),
];
