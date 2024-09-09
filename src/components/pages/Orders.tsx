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

  const add = async () => {
    const response = await fetch(`${config.apiUrl}/orders`, {
      method: "POST",
      body: JSON.stringify({
        invoiceNumber: "invoiceNumber",
        destination: "destination",
        date: new Date(),
        weight: 100,
        assignedTo: {
          numberPlate: "numberPlate",
          capacity: 1000,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const remove = async (invoiceNumber: string) => {
    const response = await fetch(`${config.apiUrl}/orders/${invoiceNumber}`, {
      method: "DELETE",
    });
    console.log(response);
  };

  const update = async (invoiceNumber: string) => {
    const response = await fetch(`${config.apiUrl}/orders/${invoiceNumber}`, {
      method: "PUT",
      body: JSON.stringify({
        invoiceNumber: "invoiceNumber",
        destination: "destination updated",
        date: new Date(),
        weight: 100,
        assignedTo: {
          numberPlate: "numberPlate",
          capacity: 1000,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={add}>
        Add
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => remove("invoiceNumber")}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => update("invoiceNumber")}
      >
        Update
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Destination</TableCell>
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
                  {order.destination}
                </TableCell>
                <TableCell align="right">{order.date.toString()}</TableCell>
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
