import { Order } from "@/Models/Order";
import { IProductsService } from "../../Interface/Products/IProductsService";
import Http from "../Http/HttpClient";

export class OrderService implements IProductsService {
  async getAll(branchId: number): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/Order/getAllOrder?branchId=${branchId}&desde=17/03/2025&hasta=19/03/2025&userName=`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return result;
  }

  async create(model: Order): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.post(`/api/Order`,model)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return result;
  }
}

const OrderS = new OrderService();
export default OrderS;
