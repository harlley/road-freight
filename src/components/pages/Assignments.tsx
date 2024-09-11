import { useQuery } from "react-query";
import { useState } from "react";
import { api } from "../../api";
import { Vehicle, Order } from "../../types";
import { Datagrid } from "../Datagrid";
import { Button, Stack } from "@mui/material";

const keyVehicles = ["vehicles"];
const keyOrders = ["orders"];

export function Assignments() {
  const [selectedtVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [selectedOrder, setSelectedtOrder] = useState<Order>();

  const { data: vehicles } = useQuery<Vehicle[]>(keyVehicles, api.getVehicles);
  const { data: orders } = useQuery<Order[]>(keyOrders, api.getOrders);
  return (
    <>
      <Stack gap={2}>
        <Datagrid
          rows={orders}
          columns={["Date", "Invoice Number", "Weight (Kg)", "Destination"]}
          onSelect={(order) => setSelectedtOrder(order)}
        />
        <Datagrid
          rows={vehicles}
          columns={["Number Plate", "Capacity"]}
          onSelect={(vehicle) => setSelectedVehicle(vehicle)}
        />
      </Stack>
      {selectedtVehicle && selectedOrder && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log(selectedOrder, selectedtVehicle)}
          sx={{ marginTop: 2 }}
        >
          Assign Order
        </Button>
      )}
      <br />
      {JSON.stringify(selectedOrder, null, 2)}
      <br />
      {JSON.stringify(selectedtVehicle, null, 2)}
    </>
  );
}
