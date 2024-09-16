import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Vehicle, Order, Shipping } from "../../types";
import { Datagrid } from "../Datagrid";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const keyVehicles = ["vehicles"];
const keyOrders = ["orders"];

export function Assignments() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [selectedtVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedOrder, setSelectedtOrder] = useState<Order | null>();

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
    if (selectedtVehicle || selectedOrder) {
      const shipping: Shipping = {
        date: date.toDate().toISOString().split("T")[0],
        vehicleId: selectedtVehicle?.id,
        orderId: selectedOrder?.id,
      };
      assignOrder(shipping);
      setSelectedtOrder(null);
    }
  };

  const unassignHandler = () => {
    if (selectedOrder) {
      unassignOrder(selectedOrder.id as Pick<Order, "id">);
      setSelectedtOrder(null);
    }
  };

  useEffect(() => {
    setSelectedVehicle(null);
  }, [selectedOrder]);

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
          onSelect={(order) => setSelectedtOrder(order)}
          selectedRow={selectedOrder}
        />

        <Typography variant="h6">Vehicles</Typography>
        <Datagrid
          sticky
          rows={vehicles}
          columns={["Number Plate", "Capacity (Kg)", "Availability (Kg)"]}
          hiddenColumns={["id"]}
          onSelect={(vehicle) => setSelectedVehicle(vehicle)}
          selectedRow={selectedtVehicle}
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

      {selectedtVehicle &&
        selectedOrder?.assigned === "" &&
        Number(selectedtVehicle.availability) >=
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
