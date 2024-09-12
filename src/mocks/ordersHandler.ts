import { http, HttpResponse } from "msw";
import { config } from "../config";
import { Order, Shipping, Vehicle } from "../types";

export const ordersHandler = [
  http.post(`${config.apiUrl}/orders`, async ({ request }) => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = (await request.json()) as Order;
    if (orders.find((order: Order) => order.invoice === newOrder.invoice)) {
      return HttpResponse.json(
        { message: "Order with the same invoice number already exists" },
        { status: 400 }
      );
    }
    orders.push({ id: window.crypto.randomUUID(), ...newOrder });
    localStorage.setItem("orders", JSON.stringify(orders));
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.get(`${config.apiUrl}/orders`, async () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const shipping = JSON.parse(localStorage.getItem("shipping") || "[]");
    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");

    const ordersWithShipping = orders.map((order: Order) => {
      const shippingData = shipping.find(
        (shipping: Shipping) => shipping.orderId === order.id
      );

      const vehicle: Vehicle = vehicles.find(
        (vehicle: Vehicle) => vehicle.id === shippingData?.vehicleId
      );
      return {
        ...order,
        assigned: vehicle ? vehicle.numberPlate : "",
      };
    });

    return HttpResponse.json(ordersWithShipping);
  }),

  http.delete(`${config.apiUrl}/orders/:id`, async ({ params }) => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const index = orders.findIndex((order: Order) => order.id === params.id);

    if (index !== -1) {
      orders.splice(index, 1);
      localStorage.setItem("orders", JSON.stringify(orders));
      return HttpResponse.json(undefined, { status: 204 });
    }

    return HttpResponse.json({ message: "Order not found" }, { status: 404 });
  }),

  http.put(`${config.apiUrl}/orders/:id`, async ({ params, request }) => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const index = orders.findIndex((order: Order) => order.id === params.id);

    if (index !== -1) {
      const updatedOrder = (await request.json()) as Order;
      orders[index] = updatedOrder;
      localStorage.setItem("orders", JSON.stringify(orders));
      return HttpResponse.json(updatedOrder, { status: 200 });
    }

    return HttpResponse.json({ message: "Order not found" }, { status: 404 });
  }),

  http.patch(
    `${config.apiUrl}/orders/:id/unsign-vehicle`,
    async ({ params }) => {
      const shipping = JSON.parse(localStorage.getItem("shipping") || "[]");
      const index = shipping.findIndex(
        (s: Shipping) => s.orderId === params.id
      );

      if (index !== -1) {
        shipping.splice(index, 1);
        localStorage.setItem("shipping", JSON.stringify(shipping));
        return HttpResponse.json(undefined, { status: 204 });
      }

      return HttpResponse.json(
        { message: "Shipping not found" },
        { status: 404 }
      );
    }
  ),
];
