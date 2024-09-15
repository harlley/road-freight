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
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import styles from "./Datagrid.module.css";
import { Entity } from "../../types";

type DatagrodProps<T extends Entity> = {
  rows: T[] | undefined;
  columns: string[];
  onSelect: (row: T | null) => void;
  sticky?: boolean;
  selectedRow?: T | null;
  selectable?: boolean;
  hiddenColumns?: string[]; // Added hiddenColumns prop
};

export function Datagrid<T extends Entity>({
  rows,
  columns,
  onSelect,
  sticky = false,
  selectedRow,
  selectable = true,
  hiddenColumns = [], // Default value for hiddenColumns
  ...rest
}: DatagrodProps<T>) {
  const [selected, setSelected] = useState<T | null>(selectedRow || null);
  const theme = useTheme();

  const selectHandler = (row: T) => {
    const isSelected = selected?.id === row.id;
    const newSelect = isSelected ? null : row;
    setSelected(newSelect);
    onSelect(newSelect);
  };

  useEffect(() => {
    setSelected(selectedRow ?? null);
  }, [selectedRow]);

  return (
    <TableContainer
      component={Paper}
      className={clsx(sticky ? styles.tableContainer : null)}
      {...rest}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow
              className={styles.tableRow}
              key={row.id}
              onClick={selectable ? () => selectHandler(row) : undefined}
              sx={{
                backgroundColor:
                  selected?.id === row.id
                    ? theme.palette.action.hover
                    : theme.palette.background.default,
              }}
            >
              {Object.keys(row)
                .filter((column) => !hiddenColumns.includes(column))
                .map((column, index) => (
                  <TableCell key={index}>{row[column]}</TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
