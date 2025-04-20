import { Order } from "@/Models/Order";

export interface IOrderService {
  getAll(branchId: number, desde: string, hasta: string): Promise<any>;
  create(model: Order): Promise<any>;
}
