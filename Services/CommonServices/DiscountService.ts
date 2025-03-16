import { IDiscountService } from "@/Interface/Common/IDiscountService";
import Http from "../Http/HttpClient";

export class DiscountService implements IDiscountService {
  async getAll(UserID: number): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/branch?userID=${UserID}`)
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

const discount = new DiscountService();
export default discount;
