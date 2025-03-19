export interface ICompanyService {
    getAllBranches(branchId: number, token:string): Promise<any>;
    get(branchId: number, token:string): Promise<any>;
  }
  