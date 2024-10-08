import { useMutation, useQuery, useQueryClient } from "react-query";
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
import { calculateRoutes } from "../../calculateRoutes";

const keyVehicles = ["vehicles"];
const keyVehiclesOrders = ["vehiclesOrders"];
const keyWarehouses = ["warehouses"];

type UpdateShippingsSort = {
  ordersToSort: string[];
  path: number[];
};

export function Routes() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>();
  const [selectedOrder, setSelectedtOrder] = useState<Order | null>();
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<Warehouse | null>();

  const queryClient = useQueryClient();

  const { data: vehicles } = useQuery<Vehicle[]>(keyVehicles, api.getVehicles);

  const { data: orders } = useQuery<Order[]>(
    [keyVehiclesOrders, selectedVehicle?.id, date.toString()],
    () =>
      api.getVehiclesOrders(
        selectedVehicle?.id as Pick<Vehicle, "id">,
        date.toString(),
      ),
    {
      enabled: !!selectedVehicle,
    },
  );

  const { data: warehouses } = useQuery<Warehouse[]>(
    keyWarehouses,
    api.getWarehouses,
  );

  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(warehouses[0]);
    }
  }, [warehouses, selectedWarehouse]);

  const {
    mutate: updateShippingsSort,
    isLoading: isLoadingUpdateShippingSort,
  } = useMutation(
    async ({ ordersToSort, path }: UpdateShippingsSort) => {
      await api.patchShippingsSort(ordersToSort, path);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(keyVehiclesOrders);
      },
    },
  );

  const warehouseChangeHandler = (event: SelectChangeEvent<string>) => {
    const selectedWarehouse = warehouses?.find(
      (warehouse) => warehouse.id === event.target.value,
    );
    setSelectedWarehouse(selectedWarehouse || null);
  };

  const dateChangeHandler = (val: Dayjs | null) => {
    if (val) setDate(val);
    setSelectedVehicle(null);
  };

  const calculateRoutesHandler = async () => {
    const path = await calculateRoutes(selectedWarehouse!, orders!);
    const pathWithoutWarehouse = path.slice(1);
    const ordersToSort =
      orders?.map((order) => order.id).filter((id): id is string => !!id) || [];
    updateShippingsSort({ ordersToSort, path: pathWithoutWarehouse });
  };

  return (
    <>
      <Box component={Paper} sx={{ padding: 2, mb: 2, mt: 2, display: "flex" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Shipping Date"
            value={dayjs(date)}
            onChange={dateChangeHandler}
          />
        </LocalizationProvider>

        <FormControl fullWidth sx={{ ml: 2 }}>
          <InputLabel id="origin">Origin</InputLabel>
          <Select
            labelId="origin"
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
          hiddenColumns={["id"]}
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
                "#",
                "Date",
                "Invoice Number",
                "Weight (Kg)",
                "Destination",
                "Assigned",
              ]}
              onSelect={(order) => setSelectedtOrder(order)}
              hiddenColumns={["latitude", "longitude", "id"]}
              selectedRow={selectedOrder}
              selectable={false}
            />
          </>
        )}
      </Stack>
      {selectedVehicle && orders && orders.length > 0 && (
        <Button
          variant="contained"
          onClick={calculateRoutesHandler}
          sx={{ mb: 2 }}
        >
          {isLoadingUpdateShippingSort ? "Calculating..." : "Calculate Routes"}
        </Button>
      )}
    </>
  );
}
