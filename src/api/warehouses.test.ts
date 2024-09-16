import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getWarehouses, postWarehouses, deleteWarehouses } from "./warehouses";
import { config } from "../config";
import { Warehouse } from "../types";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const headers = { "Content-Type": "application/json" };

describe("Warehouse API functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getWarehouses", () => {
    it("should fetch warehouses successfully", async () => {
      const mockWarehouses = [{ id: 1, name: "Warehouse 1" }];
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockWarehouses),
      });

      const result = await getWarehouses();

      expect(mockFetch).toHaveBeenCalledWith(`${config.apiUrl}/warehouses`);
      expect(result).toEqual(mockWarehouses);
    });
  });

  describe("postWarehouses", () => {
    it("should post a warehouse successfully", async () => {
      const mockWarehouse: Warehouse = {
        id: "1",
        name: "New Warehouse",
        address: "123 Test St",
        latitude: "0",
        longitude: "0",
      };
      const mockResponse = {
        id: 1,
        name: "New Warehouse",
        createdAt: "2023-04-01",
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await postWarehouses(mockWarehouse);

      expect(mockFetch).toHaveBeenCalledWith(`${config.apiUrl}/warehouses`, {
        method: "POST",
        body: JSON.stringify(mockWarehouse),
        headers,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error for server errors", async () => {
      mockFetch.mockResolvedValueOnce({
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      });

      await expect(
        postWarehouses({
          id: "1",
          name: "Error Warehouse",
          address: "Test Address",
          latitude: "0",
          longitude: "0",
        }),
      ).rejects.toThrow("Server error: 500 - Internal Server Error");
    });

    it("should throw an error for non-ok responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Bad Request"),
      });

      await expect(
        postWarehouses({
          id: "1",
          name: "Bad Warehouse",
          address: "",
          latitude: "",
          longitude: "",
        }),
      ).rejects.toThrow("Bad Request");
    });
  });

  describe("deleteWarehouses", () => {
    it("should delete a warehouse successfully", async () => {
      const mockResponse = { status: 204, statusText: "No Content" };
      mockFetch.mockResolvedValueOnce(mockResponse);

      try {
        const warehouseId = { id: "1" }; // Pass an object with an id property
        const result = await deleteWarehouses(warehouseId);
        console.log("Response:", result); // Debugging log

        expect(mockFetch).toHaveBeenCalledWith(
          `${config.apiUrl}/warehouses/${warehouseId}`,
          {
            method: "DELETE",
          },
        );
        expect(result).toEqual(mockResponse);
      } catch (error) {
        console.error("Error:", error); // Debugging log
        throw error; // Re-throw the error to fail the test
      }
    });
  });
});
