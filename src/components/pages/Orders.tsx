import { Button, Modal } from "@mui/material";
import { useQuery } from "react-query";
import { Order } from "../../types";
import { useState } from "react";
import { OrdersDatagrid } from "../OrdersDatagrid";
import { OrdersForm } from "../OrdersForm";
import { getOrders } from "../../api/orders";

export function Orders() {
  const [openModal, setOpenModal] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<Order[]>("orders", getOrders);

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
      >
        Create Order
      </Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <OrdersForm />
      </Modal>
      <OrdersDatagrid orders={orders} />
    </>
  );
}
