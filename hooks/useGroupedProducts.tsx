import { useMemo } from "react";
import { Product } from "@/Models/Product";

const useGroupedProducts = (products: Product[]) => {
  return useMemo(() => {
    const groupedProducts: { [key: string]: Product } = {};

    products.forEach((product) => {
      const key = `${product.code}-${product.name}`;

      if (groupedProducts[key]) {
        groupedProducts[key].stock! += product.stock!;
      } else {
        groupedProducts[key] = { ...product };
      }
    });

    return Object.values(groupedProducts);
  }, [products]);
};

export default useGroupedProducts;
