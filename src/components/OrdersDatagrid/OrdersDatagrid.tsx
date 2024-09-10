import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Order } from "../../types";

type OrdersDatagridProps = {
  orders: Order[] | undefined;
};

export function OrdersDatagrid({ orders }: OrdersDatagridProps) {
  return (
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
          {orders?.map((order: Order) => (
            <TableRow key={order.invoiceNumber}>
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
  );
}
