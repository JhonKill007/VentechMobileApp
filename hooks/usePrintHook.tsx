import { useUserContext } from "@/context/UserContext/UserContext";
import { Branch } from "@/Models/Branch";
import { Company } from "@/Models/Company";
import { Order } from "@/Models/Order";
import * as Print from "expo-print";
import { Alert } from "react-native";

export const usePrintHook = () => {

  const { branch, company } = useUserContext();

  const rePrintOrder = async (orden: Order) => {
    try {
      var totalOrden = 0;
      var totalItbis = 0;
      var razonSocial = "";
      var tipoDeFactura = "";
      var montoDescuento = 0;
  
      orden.products!.forEach((o) => {
        totalOrden +=
          o.productPrice! * o.productAmount! -
          gerPercent(o.productPrice! * o.productAmount!, o.discountPorcent!);
        totalItbis +=
          o.itbis! * o.productAmount! -
          gerPercent(o.itbis! * o.productAmount!, o.discountPorcent!);
        montoDescuento += o.totalDiscount! * o.productAmount!;
      });
  
      if (orden.rncOCedula!.length >= 9) {
        tipoDeFactura = "CON CRÉDITO FISCAL";
        razonSocial = `Razon Social: ${orden.razonSocial}<br />`;
      } else {
        tipoDeFactura = "PARA CONSUMIDOR FINAL";
      }
      const companySelected: Company = {
        name: company?.name,
        rnc: company?.rnc,
      };
      const branchSelected: Branch = {
        address: branch?.address,
        cellPhone: branch?.cellPhone,
      };
  
      var invoice = `
          <!DOCTYPE html>
              <html lang="es">
                <head>
                  <meta charset="UTF-8" />
                  <title>Factura</title>
                  <style>
                    body {
                      padding: 0px 7px 0 8px;
                      font-family: Arial, sans-serif;
                    }
                    .header {
                      text-align: center;
                    }
                    .section {
                      margin-top: 20px;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    th,
                    td {
                      border: 1px solid black;
                      padding: 8px;
                      text-align: left;
                    }
                    .totals {
                      text-align: right;
                    }
                    @media print {
                      /* Indicar al navegador que divida las páginas cuando el contenido exceda el límite */
                      .corte {
                        page-break-inside: avoid;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h2>${companySelected.name}</h2>
                  </div>
                  <div class="section">
                    <p>
                      ${branchSelected.address}
                      <br />TEL:${branchSelected.cellPhone} <br />RNC: ${companySelected.rnc}
                      <br />NCF: ${orden.ncf} <br />Fecha: ${formatDate(orden.dateHour)}
                    </p>
                    <hr />
                    <div style="text-align: center">
                      <span style="font-weight: bold">FACTURA ${tipoDeFactura}</span>
                    </div>
                    <hr />
                  </div>
                  <div class="section">
                    <table style="border: none; width: 100%">
                      <tr>
                        <th style="border: none">Descripción</th>
                        <th style="border: none">itbis</th>
                        <th style="border: none">valor</th>
                      </tr>
                      ${orden .products!.map( (a) => `
                      <tr>
                        <td style="border: none">${a.productName} * ${a.productAmount}</td>
                        <td style="border: none">
                          ${(a.itbis! * a.productAmount!).toLocaleString( "en-US", { style:
                          "currency", currency: "USD", } )}
                        </td>
                        <td style="border: none">
                          ${( a.productPrice! * a.productAmount! ).toLocaleString("en-US", {
                          style: "currency", currency: "USD" })}
                        </td>
                      </tr>
                      ` ) .join("")}
                    </table>
                  </div>
                  <hr />
                  <div class="section totals">
                    <p>
                      subtotal: ${(totalOrden - totalItbis).toLocaleString("en-US", { style:
                      "currency", currency: "USD", })}
                    </p>
                    <p>
                      itbis: ${totalItbis.toLocaleString("en-US", { style: "currency",
                      currency: "USD", })}
                    </p>
                    <p>
                      Descuento: -${montoDescuento.toLocaleString("en-US", { style:
                      "currency", currency: "USD", })}
                    </p>
                    <p>
                      Total: ${totalOrden.toLocaleString("en-US", { style: "currency",
                      currency: "USD", })}
                    </p>
                  </div>
                  <hr />
                  <div class="section">
                    <p>
                      Forma de Pago: ${orden.payMethod} <br />Pagó con:
                      ${orden.payWith!.toLocaleString("en-US", { style: "currency", currency:
                      "USD", })} <br />Cambio: ${(orden.payWith! -
                      totalOrden).toLocaleString("en-US", { style: "currency", currency:
                      "USD", })}
              
                      <br />Cajero(a): ${orden.cajero}
                    </p>
                  </div>
                  <hr />
                  <div style="text-align: center">
                    <span>DATOS DEL CLIENTE</span>
                  </div>
                  <hr />
              
                  <p>
                    ${ orden.rncOCedula!.length > 0 ? `RNC/Cedula: ${orden.rncOCedula} <br />
                    ${razonSocial} ` : "" } Cliente:${orden.consumer!.name}
                    <br />Tel: ${orden.consumer!.cellPhone} <br />Dirección:
                    ${orden.consumer!.address}
                  </p>
                  <div class="corte"></div>
                </body>
              </html>
          `;
  
      await Print.printAsync({ html: invoice });
    } catch (error) {
      console.error("Error al imprimir:", error);
      Alert.alert("Error", "No se pudo imprimir el documento");
    }
  };
  
  const formatDate = (apiDate: any) => {
    const date = new Date(apiDate);
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    } as const;
    return date.toLocaleString("es-ES", options);
  };
  
  const gerPercent = (amount: number, percent: number) => {
    return (amount * percent) / 100;
  };
  
  return { rePrintOrder }
}
