import { Consumer } from "./Consumer";
import { OrderProduct } from "./OrderProduct";

export class Order {
  public id?: number | undefined;
  public consumer: Consumer | undefined;
  public ncf?: string | undefined;
  public branchId: number | undefined;
  public companyId: number | undefined;
  public payWith: number | undefined;
  public rncOCedula: string | undefined;
  public hasComprobante: boolean | undefined;
  public payMethod: string | undefined;
  public products: OrderProduct[] | undefined;
  public UserName?: string | undefined;
  public discountPercent: number | undefined;
  public razonSocial: string | undefined;
  public cajero?: string | undefined;
  public dateHour: string | undefined;
  public total: number | undefined;
  public byDelivery: boolean | undefined;
  public toCaja: boolean | undefined;
  public deliveryId: number | undefined;
}
