import { useQuery } from "react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery("orders", async () => {
    const response = await fetch(`${config.apiUrl}/orders`);
    const data = await response.json();
    return data;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

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
