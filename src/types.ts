import { ReactNode } from "react";

export interface Entity {
  id?: string;
  [key: string]: string | ReactNode;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Vehicle extends Entity {
  numberPlate: string;
  weightCapacity: number;
  availability?: number;
}

export interface Order extends Entity, Coordinates {
  date: string;
  weight: number;
  invoice: string;
  destination: string;
  assigned?: string;
}

export interface Shipping extends Entity {
  date: number;
  vehicleId: string | undefined;
  orderId: string | undefined;
}

export interface Warehouse extends Entity, Coordinates {
  name: string;
  address: string;
}

export interface Suggestion {
  label: string;
  id: string;
}
export interface SuggestionItem {
  title: string;
  id: string;
}
