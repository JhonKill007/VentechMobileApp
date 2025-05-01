import { SelectProduct } from "@/Models/SelectProduct";

export const useCountHook = () => {
  const getOriginValue = (valorFinal: number, porcentaje: number) => {
    return valorFinal / (1 - porcentaje / 100);
  };

  const getValuePercent = (amount: number, percent: number) => {
    return (amount * percent) / 100;
  };

  const getValueDescont = (valorFinal: number, porcentaje: number) => {
    return valorFinal * (porcentaje / (100 - porcentaje));
  };

  // const getTotalItbis = (descuento: number, Products: SelectProduct[]) => {
  //   const total = Products.reduce((total: number, item: any) => {
  //     return (
  //       total +
  //       ((item.product.price * item.product.itbis) / 100) * item.cantidad
  //     );
  //   }, 0);

  //   return descuento ? total - (total * descuento) / 100 : total;
  // };

  const getTotalItbis = (Products: SelectProduct[], descuento?: number) => {
    const total = Products.reduce((total: number, item: any) => {
      return (
        total +
        getTotalItbisSingle(item.product.price, item.product.itbis) *
          item.cantidad
      );
    }, 0);

    return descuento ? total - (total * descuento) / 100 : total;
  };

  const getTotalItbisSingle = (
    precioConImpuesto: number,
    porcentajeImpuesto: number,
    descuento?: number
  ) => {
    const factor = 1 + porcentajeImpuesto / 100;
    const neto = +(precioConImpuesto / factor).toFixed(2);
    const impuesto = +(precioConImpuesto - neto).toFixed(2);
    return descuento ? impuesto - (impuesto * descuento) / 100 : impuesto;
  };

  const getTotalPrice = (Products: SelectProduct[], descuento?: number) => {
    const total = Products.reduce((total: number, item: any) => {
      return total + item.cantidad * item.product.price;
    }, 0);

    return descuento ? total - (total * descuento) / 100 : total;
  };

  const getTotalCantidadProducto = (Products: SelectProduct[]) => {
    return Products.reduce((total: number, item: any) => {
      return total + item.cantidad;
    }, 0);
  };

  // const getTotalItbisSingle = (descuento: number, item: SelectProduct) => {
  //   const total =
  //     ((item.product!.price! * item.product!.itbis!) / 100) * item.cantidad!;
  //   return descuento ? total - (total * descuento) / 100 : total;
  // };

  const getTotalPriceSingle = (descuento: number, item: SelectProduct) => {
    const total = item.cantidad! * item.product!.price!;
    return descuento ? total - (total * descuento) / 100 : total;
  };

  return {
    getValuePercent,
    getTotalItbis,
    getTotalPrice,
    getTotalCantidadProducto,
    getTotalItbisSingle,
    getTotalPriceSingle,
    getValueDescont,
    getOriginValue,
  };
};
