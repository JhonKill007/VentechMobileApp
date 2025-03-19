import { ICompanyService } from "@/Interface/Company/ICompanyService";
import Http from "../Http/HttpClient";

export class CompanyService implements ICompanyService {
  async getAllBranches(UserID: number, token:string): Promise<any> {
    Http.defaults.headers["Authorization"] = `Bearer ${token}`;
    console.log(token);
    
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
  async get(UserID: number, token:string): Promise<any> {
    Http.defaults.headers["Authorization"] = `Bearer ${token}`;
    console.log(token);
    
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/company?userID=${UserID}`)
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
