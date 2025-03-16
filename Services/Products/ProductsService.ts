import { IProductsService } from "../../Interface/Products/IProductsService";
import Http from "../Http/HttpClient";

export class ProductsService implements IProductsService {
  async getAll(branchId: number): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/Product?BranchId=${branchId}`)
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

const Products = new ProductsService();
export default Products;
