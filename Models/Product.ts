export class Product {
  public id: number | undefined;
  public code: string | undefined;
  public name: string | undefined;
  public description?: string | undefined;
  public price?: number | undefined;
  public priceBase?: number | undefined;
  public expDate?: string | undefined;
  public laboratory?: string | undefined;
  public stock?: number | undefined;
  public productTypeId?: number | undefined;
  public photo?: string | undefined;
  public itbis?: number | undefined;
  public companyId?: number | undefined;
  public dose?: string | undefined;
  public pharForms?: string | undefined;
  public composition?: string | undefined;
  public branchId?: number | undefined;
  public branchProductId?: number | undefined;
  //   public productLocation?: ProductLocation;
  public isPerishable?: boolean | undefined;
  public notifyWhenStockMinor?: number | undefined;
  public notifyWhenDaysRemain?: number | undefined;
  public clientId?: number | undefined;
}
