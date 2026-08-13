import { Order } from "../types/order";

export const mockOrders: Order[] = [
  { id: "1", orderNumber: "#NK231561", date: "May 14, 2026", itemName: "Human fall flat", total: 19.99, status: "completed" },
  { id: "2", orderNumber: "#NK23568", date: "May 12, 2026", itemName: "Crimsom Desert...", total: 249.99, status: "completed" },
  { id: "3", orderNumber: "#NK23568", date: "May 12, 2026", itemName: "Cyberpunk 2077", total: 120.98, status: "completed" },
  { id: "4", orderNumber: "#NK23568", date: "May 12, 2026", itemName: "GTA VI", total: 140.99, status: "pending" },
  { id: "5", orderNumber: "#NK23568", date: "May 12, 2026", itemName: "Project Zomboid", total: 120.98, status: "completed" },
  { id: "6", orderNumber: "#NK23568", date: "May 12, 2026", itemName: "Stardew Valley", total: 120.98, status: "refunded" },
];