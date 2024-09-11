import { ReactNode } from "react";

export interface Entity {
  id?: string;
  [key: string]: string | ReactNode;
}

export interface Vehicle extends Entity {
  numberPlate: string;
  weightCapacity: number;
}

export interface Order extends Entity {
  date: string;
  weight: number;
  invoiceNumber: string;
  destination?: string;
}
