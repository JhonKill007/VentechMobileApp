import { IConsumerService } from "@/Interface/Common/IConsumerService";
import Http from "../Http/HttpClient";

export class ConsumerService implements IConsumerService {
  async getAll(companyId: number, token:string): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {

      console.log('el companyid', companyId);
      
      Http.defaults.headers["Authorization"] = `Bearer ${token}`;

      Http.get(`/api/consumer/${companyId}`)
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

const consumer = new ConsumerService();
export default consumer;
