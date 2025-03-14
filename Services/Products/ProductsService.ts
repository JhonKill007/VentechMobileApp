import { IProductsService } from "../../Interface/Products/IProductsService";
import Http from "../Http/HttpClient";

export class ProductsService implements IProductsService {
  async getAll(): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.post(`/api/Product`)
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
