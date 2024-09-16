import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler } from "react-hook-form";
import { VehiclesForm } from "../VehiclesForm";
import { api } from "../../api";
import { Vehicle } from "../../types";
import { Datagrid } from "../Datagrid";
import { Context } from "./Layout";

const key = ["vehicles"];

export function Vehicles() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Vehicle | null>();
  const { setSnackbarMessage } = useContext(Context);

  const { data: vehicles } = useQuery<Vehicle[]>(key, api.getVehicles);

  const queryClient = useQueryClient();

  const { mutate: createVehicle } = useMutation(
    async (vehicle: Vehicle) => {
      await api.postVehicles(vehicle);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
      onError: (error) => {
        const errorMessage = (error as Error).message;
        setSnackbarMessage(JSON.parse(errorMessage).message);
      },
    },
  );

  const { mutate: deleteVehicle } = useMutation(
    async (vehicle: Vehicle) => {
      await api.deleteVehicles(vehicle.id as Pick<Vehicle, "id">);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
    },
  );

  const submitHandler: SubmitHandler<Vehicle> = async (vehicle) => {
    createVehicle(vehicle);
  };

  const deleteHandler = async (vehicle: Vehicle) => {
    deleteVehicle(vehicle);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        New Vehicle
      </Button>

      {selectedOrder && (
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteHandler(selectedOrder)}
          sx={{ mb: 2, ml: 2 }}
        >
          Delete
        </Button>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <VehiclesForm submitHandler={submitHandler} />
        </div>
      </Modal>

      <Datagrid
        rows={vehicles}
        columns={["Number Plate", "Capacity (Kg)"]}
        onSelect={(order) => setSelectedOrder(order)}
        hiddenColumns={["availability", "id"]}
      />
    </>
  );
}
