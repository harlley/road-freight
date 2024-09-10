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
            <TableCell>Date</TableCell>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Weight (Kg)</TableCell>
            <TableCell>Destination</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order: Order) => (
            <TableRow key={order.invoiceNumber}>
              <TableCell>{order.date?.toString()}</TableCell>
              <TableCell>{order.invoiceNumber}</TableCell>
              <TableCell>{order.weight}</TableCell>
              <TableCell>{order.destination}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
