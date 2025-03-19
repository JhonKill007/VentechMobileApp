export interface IProductsService {
  getAll(branchId: number,desde:string, hasta:string): Promise<any>;
}
