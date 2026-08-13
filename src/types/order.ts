export type OrderStatus = "completed" | "pending" | "refunded";

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  itemName: string;
  total: number;
  status: OrderStatus;
};