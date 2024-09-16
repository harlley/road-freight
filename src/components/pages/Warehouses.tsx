import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler } from "react-hook-form";
import { WarehousesForm } from "../WarehousesForm";
import { api } from "../../api";
import { Warehouse } from "../../types";
import { Datagrid } from "../Datagrid";

const key = ["warehouses"];

export function Warehouses() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<Warehouse | null>();

  const { data: warehouses } = useQuery<Warehouse[]>(key, api.getWarehouses);

  const queryClient = useQueryClient();

  const { mutate: createWarehouse } = useMutation(
    key,
    async (warehouse: Warehouse) => {
      await api.postWarehouses(warehouse);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
    },
  );

  const { mutate: deleteWarehouse } = useMutation(
    async (warehouse: Warehouse) => {
      await api.deleteWarehouses(warehouse.id as Pick<Warehouse, "id">);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
    },
  );

  const submitHandler: SubmitHandler<Warehouse> = async (warehouse) => {
    createWarehouse(warehouse);
  };

  const deleteHandler = async (warehouse: Warehouse) => {
    deleteWarehouse(warehouse);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        New Warehouse
      </Button>
      {selectedWarehouse && (
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteHandler(selectedWarehouse)}
          sx={{ mb: 2, ml: 2 }}
        >
          Delete
        </Button>
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <WarehousesForm submitHandler={submitHandler} />
        </div>
      </Modal>
      <Datagrid
        rows={warehouses}
        columns={["Name", "Address"]}
        hiddenColumns={["latitude", "longitude", "id"]}
        onSelect={(order) => setSelectedWarehouse(order)}
      />
    </>
  );
}
