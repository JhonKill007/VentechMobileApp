import { IProductsService } from "../../Interface/Products/IProductsService";
import Http from "../Http/HttpClient";

export class OrderService implements IProductsService {
  async getAll(branchId: number, token: string): Promise<any> {
    Http.defaults.headers["Authorization"] = `Bearer ${token}`;
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/Order/getAllOrder?branchId=${branchId}&desde=12/03/2025&hasta=16/03/2025&userName=`)
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

const Order = new OrderService();
export default Order;
