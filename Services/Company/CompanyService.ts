import { ICompanyService } from "@/Interface/Company/ICompanyService";
import Http from "../Http/HttpClient";
import { Company } from "@/Models/Company";

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
  async get(UserID: number): Promise<any> {

    
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
  async getById(Id: number): Promise<any> {

    
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/company/${Id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return result;
  
}
  async update(model: Company): Promise<any> {

    
    let result = await new Promise<any>((resolve, reject) => {
      Http.put(`/api/company`,model)
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

const CompanyS = new CompanyService();
export default CompanyS;
