import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler } from "react-hook-form";
import { OrdersForm } from "../OrdersForm";
import { api } from "../../api";
import { Order } from "../../types";
import { Datagrid } from "../Datagrid";
import { ContextLayout } from "./Layout";

const key = ["orders"];

export function Orders() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>();
  const { setMessage } = useContext(ContextLayout);

  const { data: orders } = useQuery<Order[]>(key, api.getOrders);

  const queryClient = useQueryClient();

  const { mutate: createOrder } = useMutation(
    async (order: Order) => {
      await api.postOrders(order);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
      onError: (error: Error) => {
        if (error.message.includes("Server error")) {
          setMessage("Something went wrong");
        } else {
          setMessage(JSON.parse(error.message).message);
        }
      },
    },
  );

  const { mutate: deleteOrder } = useMutation(
    async (id: Pick<Order, "id">) => {
      await api.deleteOrders(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
    },
  );

  const submitHandler: SubmitHandler<Order> = async (order) => {
    createOrder(order);
  };

  const deleteHandler = async (order: Order) => {
    deleteOrder(order.id as Pick<Order, "id">);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        New Order
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
          <OrdersForm submitHandler={submitHandler} />
        </div>
      </Modal>

      <Datagrid
        rows={orders}
        columns={["Date", "Invoice Number", "Weight (Kg)", "Destination"]}
        hiddenColumns={["assigned", "id", "latitude", "longitude"]}
        onSelect={(order) => setSelectedOrder(order)}
      />
    </>
  );
}
