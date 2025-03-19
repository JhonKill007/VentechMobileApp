export interface IProductsService {
  getAll(branchId: number): Promise<any>;
}
