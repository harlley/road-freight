import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler } from "react-hook-form";
import { VehiclesForm } from "../VehiclesForm";
import { api } from "../../api";
import { Vehicle } from "../../types";
import { Datagrid } from "../Datagrid";

const key = ["vehicles"];

export function Vehicles() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Vehicle>();

  const queryClient = useQueryClient();

  const { mutate: createVehicle } = useMutation(
    key,
    async (vehicle: Vehicle) => {
      await api.postVehicles(vehicle);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
    }
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
    }
  );

  const submitHandler: SubmitHandler<Vehicle> = async (vehicle) => {
    createVehicle(vehicle);
  };
  const deleteHandler = async (vehicle: Vehicle) => {
    deleteVehicle(vehicle);
  };
  const {
    data: vehicles,
    isLoading,
    isError,
  } = useQuery<Vehicle[]>(key, api.getVehicles);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

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
        columns={["Number Plate", "Capacity", "Availability"]}
        onSelect={(order) => setSelectedOrder(order)}
      />
    </>
  );
}
