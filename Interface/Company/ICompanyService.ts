export interface ICompanyService {
    getAllBranches(branchId: number): Promise<any>;
    get(branchId: number): Promise<any>;
  }
  