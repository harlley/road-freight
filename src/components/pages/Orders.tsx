import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { config } from "../../config";

type Order = {
  id: number;
  destination: string;
  date: string;
  weight: number;
  observations: string;
  assignedTo: string;
};

export function Orders() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetch(`${config.apiUrl}/orders`).then((response) => {
      response.json().then((data) => {
        setOrders(data);
      });
    });
  }, []);


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Destination</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Weight (Kg)</TableCell>
            <TableCell align="right">Observations</TableCell>
            <TableCell align="right">Assigned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order: Order) => (
            <TableRow
              key={order.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.destination}
              </TableCell>
              <TableCell align="right">{order.date}</TableCell>
              <TableCell align="right">{order.weight}</TableCell>
              <TableCell align="right">{order.observations}</TableCell>
              <TableCell align="right">{order.assignedTo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
