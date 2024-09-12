import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
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
  const [selectedtVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [selectedOrder, setSelectedtOrder] = useState<Order>();

  const { data: vehicles } = useQuery<Vehicle[]>(keyVehicles, api.getVehicles);
  const { data: orders } = useQuery<Order[]>(keyOrders, api.getOrders);

  const queryClient = useQueryClient();

  const { mutate: assignOrder } = useMutation(
    async (shipping: Shipping) => {
      await api.postShipping(shipping);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keyOrders, keyVehicles]);
      },
    }
  );

  const assignHandler = () => {
    if (selectedtVehicle || selectedOrder) {
      const shipping: Shipping = {
        date: date.toDate().getTime(),
        vehicleId: selectedtVehicle?.id,
        orderId: selectedOrder?.id,
      };
      assignOrder(shipping);
      console.log(shipping);
    }
  };
  return (
    <>
      <Box component={Paper} sx={{ padding: 2, mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dayjs(date)}
            onChange={(val) => setDate(dayjs(val))}
          />
        </LocalizationProvider>
      </Box>

      <Stack gap={2}>
        <Typography variant="h6">Orders</Typography>
        <Datagrid
          sticky
          rows={orders}
          columns={["Date", "Invoice Number", "Weight (Kg)", "Destination"]}
          onSelect={(order) => setSelectedtOrder(order)}
        />
        <Typography variant="h6">Vehicles</Typography>

        <Datagrid
          sticky
          rows={vehicles}
          columns={["Number Plate", "Capacity"]}
          onSelect={(vehicle) => setSelectedVehicle(vehicle)}
        />
      </Stack>
      {selectedtVehicle && selectedOrder && (
        <Button
          variant="contained"
          color="primary"
          onClick={assignHandler}
          sx={{ mt: 2 }}
        >
          Assign Order
        </Button>
      )}
    </>
  );
}
