export type Vehicle = {
  numberPlate: string;
  capacity: number;
};

export type Order = {
  invoiceNumber: string;
  destination?: string;
  date?: Date;
  weight?: number;
  assignedTo?: Vehicle;
};
