export interface IConsumerService {
    getAll(branchId: number, token:string): Promise<any>;

  }
  