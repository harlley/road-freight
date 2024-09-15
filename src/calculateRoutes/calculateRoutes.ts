import { headers } from "../api";
import { config } from "../config";
import { Order, Warehouse } from "../types";

export function tspNearestNeighbor(distances: number[][]): number[] {
  const n = distances.length;
  const visited = Array(n).fill(false);
  const path: number[] = [];

  let current = 0;
  visited[current] = true;
  path.push(current);

  for (let i = 1; i < n; i++) {
    let next = -1;
    let minDistance = Infinity;

    for (let j = 0; j < n; j++) {
      if (!visited[j] && distances[current][j] < minDistance) {
        next = j;
        minDistance = distances[current][j];
      }
    }

    path.push(next);
    visited[next] = true;
    current = next;
  }

  return path;
}

export async function calculateRoutes(warehouse: Warehouse, orders: Order[]) {
  const { latitude, longitude } = warehouse;
  const warehouseCoordinates = {
    lat: Number(latitude),
    lng: Number(longitude),
  };
  const ordersCoordinates = orders.map((order) => {
    const { latitude, longitude } = order;
    return { lat: Number(latitude), lng: Number(longitude) };
  });

  const response = fetch(
    `${config.here.matrixRouter}?apiKey=${config.here.apiKey}&async=false`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        origins: [warehouseCoordinates, ...ordersCoordinates],
        destinations: [warehouseCoordinates, ...ordersCoordinates],
        transportMode: "truck",
        matrixAttributes: ["distances"],
        regionDefinition: {
          type: "autoCircle",
        },
      }),
    }
  );

  const data = await (await response).json();

  const distances = data.matrix.distances;

  // convert a flat array to a matrix
  const matrix: number[][] = [];
  const columns = Math.sqrt(distances.length);
  for (let i = 0; i < distances.length; i += columns) {
    matrix.push(distances.slice(i, i + columns));
  }

  return tspNearestNeighbor(matrix);
}
