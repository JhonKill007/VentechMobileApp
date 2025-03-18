import { Consumer } from "./Consumer";
import { OrderProduct } from "./OrderProduct";

export class Order {

     public id?:number;
     public consumer?:Consumer
     public ncf?:string;
     public branchId?:number;
     public companyId?:number;
     public payWith?:number;
     public rncOCedula?:string;
     public hasComprobante?:boolean;
     public payMethod?:string;
     public products?:OrderProduct[];
     public UserName?:string;
     public discountPercent?:number;
     public razonSocial?:string;
     public cajero?:string;
     public dateHour?:string;
     public total?:number
     public byDelivery?:boolean
     public toCaja?:boolean
     public deliveryId?:number
}