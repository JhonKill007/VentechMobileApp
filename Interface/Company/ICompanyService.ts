export interface ICompanyService {
    getAllBranches(branchId: number, token:string): Promise<any>;
  }
  