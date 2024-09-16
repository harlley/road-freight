import { describe, it, expect, vi, afterEach, Mock } from "vitest";
import {
  getVehicles,
  postVehicles,
  deleteVehicles,
  putVehicles,
  postShipping,
  getVehiclesOrders,
} from "./vehicles";
import { config } from "../config";
import dayjs from "dayjs";
import { Vehicle, Shipping } from "../types";

// Mock the fetch function globally
global.fetch = vi.fn();

describe("API Service Tests", () => {
  afterEach(() => {
    vi.clearAllMocks(); // Clear the mocks after each test
  });

  describe("getVehicles", () => {
    it("should fetch vehicles successfully", async () => {
      const mockVehicles = [{ id: "1", name: "Car" }];
      (global.fetch as Mock).mockResolvedValueOnce({
        json: async () => mockVehicles,
      });

      const result = await getVehicles();
      expect(result).toEqual(mockVehicles);
      expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/vehicles`);
    });
  });

  describe("postVehicles", () => {
    // Removed unused headers constant

    it("should post a vehicle successfully", async () => {
      const mockVehicle: Vehicle = {
        id: "1",
        name: "Car",
        numberPlate: "ABC123",
        weightCapacity: 1000,
      };
      const mockResponse = { success: true };
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
        text: vi.fn().mockResolvedValueOnce(""), // Ensure text method is included
      });

      const result = await postVehicles(mockVehicle);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/vehicles`, {
        method: "POST",
        body: JSON.stringify(mockVehicle),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("should throw an error for non-ok response", async () => {
      const mockVehicle: Vehicle = {
        id: "1",
        name: "Car",
        numberPlate: "ABC123",
        weightCapacity: 1000,
      };
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        text: vi.fn().mockResolvedValueOnce("Error message"),
      });

      await expect(postVehicles(mockVehicle)).rejects.toThrow("Error message");
    });

    it("should throw a server error for 500+ response", async () => {
      const mockVehicle: Vehicle = {
        id: "1",
        name: "Car",
        numberPlate: "ABC123",
        weightCapacity: 1000,
      };
      (fetch as Mock).mockResolvedValueOnce({
        status: 500,
        text: vi.fn().mockResolvedValueOnce("Server error"),
      });

      await expect(postVehicles(mockVehicle)).rejects.toThrow(
        "Server error: 500 - Server error",
      );
    });
  });

  describe("deleteVehicles", () => {
    it("should delete a vehicle successfully", async () => {
      const vehicleId = "1"; // Use a string for the id
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(""), // Ensure text method is included
      });

      const result = await deleteVehicles(vehicleId as Pick<Vehicle, "id">); // Pass the id as a string
      expect(result.ok).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        `${config.apiUrl}/vehicles/${vehicleId}`,
        {
          method: "DELETE",
        },
      );
    });
  });

  describe("putVehicles", () => {
    it("should update a vehicle successfully", async () => {
      const id = "1"; // Use a string for the id
      const mockVehicle: Vehicle = {
        id: "1",
        name: "Updated Car",
        numberPlate: "XYZ789",
        weightCapacity: 1500,
      };
      const mockResponse = { success: true };
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
        text: vi.fn().mockResolvedValueOnce(""), // Ensure text method is included
      });

      const result = await putVehicles(id as Pick<Vehicle, "id">, mockVehicle); // Pass the id as a string
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(mockVehicle),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("postShipping", () => {
    it("should post shipping successfully", async () => {
      const mockShipping: Shipping = {
        vehicleId: "1",
        date: "2024-09-16",
        orderId: "order123", // Added orderId property
      };
      const mockResponse = { success: true };
      (fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await postShipping(mockShipping);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${config.apiUrl}/vehicles/${mockShipping.vehicleId}/orders`,
        {
          method: "POST",
          body: JSON.stringify(mockShipping),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    });
  });

  describe("getVehiclesOrders", () => {
    it("should get vehicle orders for a given date", async () => {
      const vehicleId = "1"; // Use a string for the id
      const date = "2024-09-16";
      const mockOrders = [{ id: "order1" }];
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockOrders),
        text: vi.fn().mockResolvedValueOnce(""), // Ensure text method is included
      });

      const result = await getVehiclesOrders(
        vehicleId as Pick<Vehicle, "id">,
        date,
      ); // Pass the id as a string
      expect(result).toEqual(mockOrders);
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      expect(fetch).toHaveBeenCalledWith(
        `${config.apiUrl}/vehicles/${vehicleId}/orders?date=${formattedDate}`,
      );
    });
  });
});
