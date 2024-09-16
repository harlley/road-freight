import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateRoutes } from "./calculateRoutes";
import { config } from "../config";
import { headers } from "../api";
import { Warehouse, Order } from "../types";

describe("calculateRoutes", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return a valid path based on the real coordinates", async () => {
    const warehouse: Warehouse = {
      latitude: "40.7128",
      longitude: "-74.0060",
      name: "test",
      address: "Street A",
    };
    const orders: Order[] = [
      {
        date: "2024-09-01",
        weight: 10,
        invoice: "BABABABA",
        destination: "test",
        latitude: "40.730610",
        longitude: "-73.935242",
      },
      {
        date: "2024-09-01",
        weight: 10,
        invoice: "BABABABA",
        destination: "test",
        latitude: "40.659107",
        longitude: "-73.981697",
      }, // Brooklyn, NYC
      {
        date: "2024-09-01",
        weight: 10,
        invoice: "BABABABA",
        destination: "test",
        latitude: "40.697670",
        longitude: "-73.979830",
      }, // Queens, NYC
    ];

    const mockResponse = {
      json: vi.fn().mockResolvedValue({
        matrix: {
          distances: [
            0,
            5,
            10,
            15, // distances from NYC (warehouse) to other locations
            5,
            0,
            7,
            12, // Manhattan to others
            10,
            7,
            0,
            8, // Brooklyn to others
            15,
            12,
            8,
            0, // Queens to others
          ],
        },
      }),
    };

    mockFetch.mockResolvedValue(mockResponse as unknown);

    const result = await calculateRoutes(warehouse, orders);

    expect(result).toEqual([0, 1, 2, 3]); // Expected order of visits
    expect(mockFetch).toHaveBeenCalledWith(
      `${config.here.matrixRouter}?apiKey=${config.here.apiKey}&async=false`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          origins: [
            { lat: 40.7128, lng: -74.006 }, // NYC warehouse
            { lat: 40.73061, lng: -73.935242 }, // Manhattan
            { lat: 40.659107, lng: -73.981697 }, // Brooklyn
            { lat: 40.69767, lng: -73.97983 }, // Queens
          ],
          destinations: [
            { lat: 40.7128, lng: -74.006 }, // NYC warehouse
            { lat: 40.73061, lng: -73.935242 }, // Manhattan
            { lat: 40.659107, lng: -73.981697 }, // Brooklyn
            { lat: 40.69767, lng: -73.97983 }, // Queens
          ],
          transportMode: "truck",
          matrixAttributes: ["distances"],
          regionDefinition: {
            type: "autoCircle",
          },
        }),
      },
    );
  });
});
