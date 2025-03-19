export interface IDiscountService {
    getAll(branchId: number, token:string): Promise<any>;

  }
  