import { Order } from "@/Models/Order";
import Http from "../Http/HttpClient";
import { IOrderService } from "@/Interface/Order/IOrderService";
import { CancelOrder } from "@/Models/CancelOrder";

export class OrderService implements IOrderService {
  async getAll(branchId: number, desde:string, hasta:string, username:string): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/Order/getAllOrder?branchId=${branchId}&desde=${desde}&hasta=${hasta}&userName=${username}`)
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
  async conformar607(model: any): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.post(`/api/O607/conformar607`,model)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return result;
  }
  async CancelOrder(model: CancelOrder): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.put(`/api/Order/cancelarOrder`,model)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return result;
  }

  async getResultDGII(companyId:number, encf: string): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/FacturadorElectronico/responsedgii?companyId=${companyId}&encf=${encf}`)
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
