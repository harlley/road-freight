import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler } from "react-hook-form";
import { OrdersDatagrid } from "../OrdersDatagrid";
import { OrdersForm } from "../OrdersForm";
import { api } from "../../api";
import { Order } from "../../types";

const key = ["orders"];

export function Orders() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

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
    }
  );

  const { mutate: deleteOrder } = useMutation(
    async (invoiceNumber: Pick<Order, "invoiceNumber">) => {
      await api.deleteOrders(invoiceNumber);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setOpenModal(false);
      },
    }
  );

  const submitHandler: SubmitHandler<Order> = async (order) => {
    createOrder(order);
  };

  const deleteHandler = async (order: Order) => {
    deleteOrder(order);
  };

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<Order[]>(key, api.getOrders);

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
        New Order
      </Button>
      {selectedOrder && (
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteHandler(selectedOrder)}
          sx={{ marginBottom: 2, marginLeft: 2 }}
        >
          Delete
        </Button>
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <OrdersForm submitHandler={submitHandler} />
        </div>
      </Modal>
      <OrdersDatagrid
        orders={orders}
        onSelect={(order) => setSelectedOrder(order)}
      />
      {JSON.stringify(selectedOrder, null, 2)}
    </>
  );
}
