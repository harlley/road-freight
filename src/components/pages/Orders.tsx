import { useQuery } from "react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { config } from "../../config";
import { Order } from "../../types";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { postOrders } from "../../api/orders";
import { useForm, SubmitHandler } from "react-hook-form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  width: 600,
};

export function Orders() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery("orders", async () => {
    const response = await fetch(`${config.apiUrl}/orders`);
    const data = await response.json();
    return data;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>({ shouldUseNativeValidation: false });

  const submitHandler: SubmitHandler<Order> = async (data) => {
    console.log(errors);
    await postOrders(data);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  // const save = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.target as HTMLFormElement);
  //   const order = Object.fromEntries(formData) as unknown as Order;
  //   console.log(order);
  //   await postOrders(order);
  // };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Order
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Order
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel {...register("invoiceNumber")}>
                Invoice Number
              </InputLabel>
              <OutlinedInput
                label="Invoice Number"
                fullWidth
                {...register("invoiceNumber", { required: true })}
                error={!!errors.invoiceNumber}
              />
              {errors.invoiceNumber && <FormHelperText>Error</FormHelperText>}
            </FormControl>

            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </form>
        </Box>
      </Modal>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Weight (Kg)</TableCell>
              <TableCell align="right">Assigned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow
                key={order.invoiceNumber}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.invoiceNumber}
                </TableCell>
                <TableCell align="right">{order.date?.toString()}</TableCell>
                <TableCell align="right">{order.weight}</TableCell>
                <TableCell align="right">
                  {order.assignedTo?.numberPlate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
