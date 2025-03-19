export interface IProductsService {
  getAll(branchId: number, token: string): Promise<any>;
}
