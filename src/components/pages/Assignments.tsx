import { useQuery } from "react-query";
import { useState } from "react";
import { api } from "../../api";
import { Vehicle, Order } from "../../types";
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
          rows={orders}
          columns={["Date", "Invoice Number", "Weight (Kg)", "Destination"]}
          onSelect={(order) => setSelectedtOrder(order)}
        />
        <Typography variant="h6">Vehicles</Typography>

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
          sx={{ mt: 2 }}
        >
          Assign Order
        </Button>
      )}
      <br />
      {JSON.stringify(selectedOrder, null, 2)}
      <br />
      {JSON.stringify(selectedtVehicle, null, 2)}
      <br />
      {JSON.stringify(date, null, 2)}
    </>
  );
}
