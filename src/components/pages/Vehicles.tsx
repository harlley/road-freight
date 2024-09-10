import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler } from "react-hook-form";
import { VehiclesDatagrid } from "../VehiclesDatagrid";
import { VehiclesForm } from "../VehiclesForm";
import { api } from "../../api";
import { Vehicle } from "../../types";

const key = ["vehicles"];

export function Vehicles() {
  const [openModal, setOpenModal] = useState(false);

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

  const submitHandler: SubmitHandler<Vehicle> = async (vehicle) => {
    createVehicle(vehicle);
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
        sx={{ marginBottom: 2 }}
      >
        New Vehicle
      </Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <VehiclesForm submitHandler={submitHandler} />
        </div>
      </Modal>
      <VehiclesDatagrid vehicles={vehicles} />
    </>
  );
}
