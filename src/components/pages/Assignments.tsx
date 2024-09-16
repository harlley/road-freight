import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext, useEffect, useState } from "react";
import { api } from "../../api";
import { Vehicle, Order, Shipping } from "../../types";
import { Datagrid } from "../Datagrid";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ContextLayout } from "../pages/Layout";
const keyVehicles = ["vehicles"];
const keyOrders = ["orders"];

export function Assignments() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>();
  const { setMessage } = useContext(ContextLayout);

  const { data: vehicles } = useQuery<Vehicle[]>(keyVehicles, api.getVehicles);
  const { data: orders } = useQuery<Order[]>(keyOrders, api.getOrders);

  const queryClient = useQueryClient();

  const { mutate: assignOrder } = useMutation(
    async (shipping: Shipping) => {
      await api.postShipping(shipping);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(keyOrders);
        queryClient.invalidateQueries(keyVehicles);
      },
    },
  );

  const { mutate: unassignOrder } = useMutation(
    async (orderId: Pick<Order, "id">) => {
      await api.patchOrdersUnsignVehicle(orderId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(keyOrders);
        queryClient.invalidateQueries(keyVehicles);
      },
    },
  );

  const assignHandler = () => {
    if (selectedVehicle || selectedOrder) {
      const shipping: Shipping = {
        date: date.toDate().toISOString().split("T")[0],
        vehicleId: selectedVehicle?.id,
        orderId: selectedOrder?.id,
      };
      assignOrder(shipping);
      setSelectedOrder(null);
    }
  };

  const unassignHandler = () => {
    if (selectedOrder) {
      unassignOrder(selectedOrder.id as Pick<Order, "id">);
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    setSelectedVehicle(null);
  }, [selectedOrder]);
  useEffect(() => {
    if (Number(selectedVehicle?.availability) < Number(selectedOrder?.weight)) {
      setMessage("Vehicle does not have enough space for this order");
    }
  }, [selectedVehicle, selectedOrder, setMessage]);

  return (
    <>
      <Stack gap={2} sx={{ mb: 2 }}>
        <Typography variant="h6">Orders</Typography>
        <Datagrid
          sticky
          rows={orders}
          columns={[
            "Date",
            "Invoice Number",
            "Weight (Kg)",
            "Destination",
            "Assigned",
          ]}
          hiddenColumns={["latitude", "longitude", "id"]}
          onSelect={(order) => setSelectedOrder(order)}
          selectedRow={selectedOrder}
        />

        <Typography variant="h6">Vehicles</Typography>
        <Datagrid
          sticky
          rows={vehicles}
          columns={["Number Plate", "Capacity (Kg)", "Availability (Kg)"]}
          hiddenColumns={["id"]}
          onSelect={(vehicle) => setSelectedVehicle(vehicle)}
          selectedRow={selectedVehicle}
        />
      </Stack>

      <Typography variant="h6">Shipping</Typography>
      <Box component={Paper} sx={{ padding: 2, mb: 2, mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dayjs(date)}
            onChange={(val) => setDate(dayjs(val))}
          />
        </LocalizationProvider>
      </Box>

      {selectedVehicle &&
        selectedOrder?.assigned === "" &&
        Number(selectedVehicle.availability) >=
          Number(selectedOrder.weight) && (
          <Button variant="contained" color="primary" onClick={assignHandler}>
            Assign Order to Vehicle
          </Button>
        )}

      {selectedOrder && selectedOrder?.assigned !== "" && (
        <Button variant="contained" color="error" onClick={unassignHandler}>
          Unassign Order from Vehicle
        </Button>
      )}
    </>
  );
}
