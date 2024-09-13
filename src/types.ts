import { ReactNode } from "react";

export interface Entity {
  id?: string;
  [key: string]: string | ReactNode;
}

export interface Vehicle extends Entity {
  numberPlate: string;
  weightCapacity: number;
  availability?: number;
}

export interface Order extends Entity {
  date: string;
  weight: number;
  invoice: string;
  destination: string;
  assigned?: string;
  latitude: string;
  longitude: string;
}

export interface Shipping extends Entity {
  date: number;
  vehicleId: string | undefined;
  orderId: string | undefined;
}
