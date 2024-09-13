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
};

export function Datagrid<T extends Entity>({
  rows,
  columns,
  onSelect,
  sticky = false,
  selectedRow,
  ...rest
}: DatagrodProps<T>) {
  const [select, setSelect] = useState<T | null>(selectedRow || null);
  const theme = useTheme();

  const selectHandler = (row: T) => {
    const isSelected = select?.id === row.id;
    const newSelect = isSelected ? null : row;
    setSelect(newSelect);
    onSelect(newSelect);
  };

  useEffect(() => {
    setSelect(selectedRow ?? null);
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
              onClick={() => selectHandler(row)}
              sx={{
                backgroundColor:
                  select?.id === row.id
                    ? theme.palette.action.hover
                    : theme.palette.background.default,
              }}
            >
              {Object.keys(row).map((column, index) =>
                column !== "id" ? (
                  <TableCell key={index}>{row[column]}</TableCell>
                ) : null
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
