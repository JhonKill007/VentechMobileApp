import { ICompanyService } from "@/Interface/Company/ICompanyService";
import Http from "../Http/HttpClient";

export class CompanyService implements ICompanyService {
  async getAllBranches(UserID: number): Promise<any> {
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

const Company = new CompanyService();
export default Company;
