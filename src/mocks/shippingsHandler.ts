import { http, HttpResponse } from "msw";
import { config } from "../config";
import { Shipping } from "../types";

export const shippingsHandler = [
  http.patch(`${config.apiUrl}/shippings`, async ({ request }) => {
    const body = await request.json();
    const { orders, sorts } = body as { orders: string[]; sorts: number[] };
    let shippings: Shipping[] = JSON.parse(
      localStorage.getItem("shippings") || "[]",
    );

    shippings = shippings.map((shipping) => {
      const index = shipping.orderId ? orders.indexOf(shipping.orderId) : -1;
      if (index !== -1) {
        shipping.sort = sorts[index];
      }
      return shipping;
    });

    localStorage.setItem("shippings", JSON.stringify(shippings));

    return HttpResponse.json(null, { status: 200 });
  }),
];
