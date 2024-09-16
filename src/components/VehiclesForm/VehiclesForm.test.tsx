import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VehiclesForm } from "./VehiclesForm";

describe("VehiclesForm", () => {
  it("renders the form with correct fields", () => {
    render(<VehiclesForm submitHandler={() => {}} />);

    expect(screen.getByText("New Vehicle")).toBeInTheDocument();
    expect(screen.getByTestId("numberPlate")).toBeInTheDocument();
    expect(screen.getByTestId("weightCapacity")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls submitHandler with form data when submitted", async () => {
    const mockSubmitHandler = vi.fn();
    render(<VehiclesForm submitHandler={mockSubmitHandler} />);

    fireEvent.change(screen.getByTestId("numberPlate"), {
      target: { value: "ABC123" },
    });
    fireEvent.change(screen.getByTestId("weightCapacity"), {
      target: { value: 1000 }, // Ensure value is a string if needed
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockSubmitHandler).toHaveBeenCalledWith(
        {
          numberPlate: "ABC123",
          weightCapacity: "1000",
        },
        expect.anything(),
      );
    });
  });
});
