import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { Order } from "../../types";
import { useState } from "react";
import styles from "../datagrids.module.css";

type OrdersDatagridProps = {
  orders: Order[] | undefined;
  onSelect: (order: Order) => void;
};

export function OrdersDatagrid({ orders, onSelect }: OrdersDatagridProps) {
  const [select, setSelect] = useState<Order | null>(null);
  const theme = useTheme();

  const selectHandler = (order: Order) => {
    setSelect(order);
    onSelect(order);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
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
            <TableRow
              className={styles.tableRow}
              key={order.invoiceNumber}
              onClick={() => selectHandler(order)}
              sx={{
                backgroundColor:
                  select?.invoiceNumber === order.invoiceNumber
                    ? theme.palette.action.hover
                    : theme.palette.background.default,
              }}
            >
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
