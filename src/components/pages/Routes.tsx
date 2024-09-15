import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Vehicle, Order, Warehouse } from "../../types";
import { Datagrid } from "../Datagrid";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const keyVehicles = ["vehicles"];
const keyVehiclesOrders = ["vehiclesOrders"];
const keyWarehouses = ["warehouses"];

export function Routes() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedOrder, setSelectedtOrder] = useState<Order | null>();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );

  const warehouseChangeHandler = (event: SelectChangeEvent<string>) => {
    const selectedWarehouse = warehouses?.find(
      (warehouse) => warehouse.id === event.target.value
    );
    setSelectedWarehouse(selectedWarehouse || null);
  };

  const { data: vehicles } = useQuery<Vehicle[]>(keyVehicles, api.getVehicles);
  const { data: orders } = useQuery<Order[]>(
    keyVehiclesOrders,
    () =>
      api.getVehiclesOrders(
        selectedVehicle?.id as Pick<Vehicle, "id">,
        date.toString()
      ),
    {
      enabled: !!selectedVehicle,
    }
  );

  const { data: warehouses } = useQuery<Warehouse[]>(
    keyWarehouses,
    api.getWarehouses
  );

  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(warehouses[0]);
    }
  }, [warehouses, selectedWarehouse]);

  useEffect(() => {
    setSelectedVehicle(null);
  }, [selectedOrder]);

  const calculateRoutesHandler = () => {
    console.log("orders", orders);
  };

  return (
    <>
      <Box component={Paper} sx={{ padding: 2, mb: 2, mt: 2, display: "flex" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Shipping Date"
            value={dayjs(date)}
            onChange={(val) => setDate(val as Dayjs)}
          />
        </LocalizationProvider>

        <FormControl fullWidth sx={{ ml: 2 }}>
          <InputLabel id="demo-simple-select-label">Origin</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedWarehouse?.id ?? ""}
            label="Origin"
            onChange={warehouseChangeHandler}
          >
            {warehouses?.map((warehouse) => (
              <MenuItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name} - {warehouse.address}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack gap={2} sx={{ mb: 2 }}>
        <Typography variant="h6">Vehicles</Typography>
        <Datagrid
          sticky
          rows={vehicles}
          columns={["Number Plate", "Capacity (Kg)", "Availability (Kg)"]}
          onSelect={(vehicle) => setSelectedVehicle(vehicle)}
          selectedRow={selectedVehicle}
        />

        {selectedVehicle && (
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
      {selectedVehicle && orders && orders.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={calculateRoutesHandler}
          sx={{ mb: 2 }}
        >
          Calculate Routes
        </Button>
      )}
    </>
  );
}
