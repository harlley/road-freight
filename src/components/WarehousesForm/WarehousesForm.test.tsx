import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { WarehousesForm } from "./WarehousesForm";

vi.mock("../AutoCompleteLocale", () => ({
  AutoCompleteLocale: ({ label }: { label: string }) => (
    <input aria-label={label} />
  ),
}));

describe("WarehousesForm", () => {
  const mockSubmitHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    render(<WarehousesForm submitHandler={mockSubmitHandler} />);
  });

  it("renders the form with correct title", () => {
    expect(screen.getByText("New Warehouse")).toBeDefined();
  });

  it("renders name input field", () => {
    expect(screen.getByTestId("name")).toBeDefined();
  });

  it("renders address autocomplete field", () => {
    expect(screen.getByLabelText("Address")).toBeDefined();
  });

  it("renders submit button", () => {
    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("calls submitHandler with form data when submitted", async () => {
    const nameInput = screen.getByTestId("name");
    const addressInput = screen.getByLabelText("Address");
    const submitButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "Test Warehouse" } });
    fireEvent.change(addressInput, { target: { value: "Test Address" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitHandler).toHaveBeenCalled();
    });

    expect(mockSubmitHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Warehouse",
      }),
      expect.anything(),
    );

    const [[, event]] = mockSubmitHandler.mock.calls;
    expect(event.type).toBe("submit");
    expect(event.target).toBeInstanceOf(HTMLFormElement);
  });
});
