export interface IConsumerService {
    getAll(branchId: number): Promise<any>;
    GetContribuyente(rnc: string): Promise<any>;

  }
  