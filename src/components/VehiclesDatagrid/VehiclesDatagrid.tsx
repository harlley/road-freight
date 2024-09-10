import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Vehicle } from "../../types";

type VehiclesDatagridProps = {
  vehicles: Vehicle[] | undefined;
};

export function VehiclesDatagrid({ vehicles }: VehiclesDatagridProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Number Plate</TableCell>
            <TableCell>Capacity (Kg)</TableCell>
            <TableCell>Availability (Kg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles?.map((vehicle: Vehicle) => (
            <TableRow key={vehicle.numberPlate}>
              <TableCell>{vehicle.weightCapacity}</TableCell>
              <TableCell>{vehicle.weightCapacity}</TableCell>
              <TableCell>calculate</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
