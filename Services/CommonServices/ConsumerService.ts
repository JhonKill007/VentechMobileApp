import { IConsumerService } from "@/Interface/Common/IConsumerService";
import Http from "../Http/HttpClient";

export class ConsumerService implements IConsumerService {
  async getAll(companyId: number): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
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

  async GetContribuyente(rnc: string): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/Contribuyente?rnc=${rnc}`)
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
