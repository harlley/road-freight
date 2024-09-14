import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Vehicle, Order } from "../../types";
import { Datagrid } from "../Datagrid";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const keyVehicles = ["vehicles"];
const keyOrders = ["orders"];

export function Routes() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [selectedtVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedOrder, setSelectedtOrder] = useState<Order | null>();

  const { data: vehicles } = useQuery<Vehicle[]>(keyVehicles, api.getVehicles);
  const { data: orders } = useQuery<Order[]>(keyOrders, api.getOrders);

  useEffect(() => {
    setSelectedVehicle(null);
  }, [selectedOrder]);

  return (
    <>
      <Box component={Paper} sx={{ padding: 2, mb: 2, mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dayjs(date)}
            onChange={(val) => setDate(dayjs(val))}
          />
        </LocalizationProvider>
      </Box>

      <Stack gap={2} sx={{ mb: 2 }}>
        <Typography variant="h6">Vehicles</Typography>
        <Datagrid
          sticky
          rows={vehicles}
          columns={["Number Plate", "Capacity (Kg)", "Availability (Kg)"]}
          onSelect={(vehicle) => setSelectedVehicle(vehicle)}
          selectedRow={selectedtVehicle}
        />

        {selectedtVehicle && (
          <>
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
              onSelect={(order) => setSelectedtOrder(order)}
              selectedRow={selectedOrder}
            />
          </>
        )}
      </Stack>
    </>
  );
}
