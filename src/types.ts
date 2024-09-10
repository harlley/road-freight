export type Vehicle = {
  numberPlate: string;
  weightCapacity: number;
};

export type Order = {
  date: Date;
  weight: number;
  invoiceNumber: string;
  destination?: string;
};
