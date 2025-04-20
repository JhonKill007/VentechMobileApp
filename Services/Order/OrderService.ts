import { Order } from "@/Models/Order";
import Http from "../Http/HttpClient";
import { IOrderService } from "@/Interface/Order/IOrderService";

export class OrderService implements IOrderService {
  async getAll(branchId: number, desde:string, hasta:string): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/Order/getAllOrder?branchId=${branchId}&desde=${desde}&hasta=${hasta}&userName=`)
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
