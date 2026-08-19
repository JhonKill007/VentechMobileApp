import { useUserContext } from "@/context/UserContext/UserContext";
import { Branch } from "@/Models/Branch";
import { Company } from "@/Models/Company";
import { Order } from "@/Models/Order";
import * as Print from "expo-print";
import { Alert } from "react-native";
import { useCountHook } from "./useCountHook";
import { ResultadoDGII } from "@/Models/ResultadoDGII";
import RNQRGenerator from "rn-qr-generator";

export const usePrintHook = () => {
  const { branch, company } = useUserContext();
  const { getValuePercent } = useCountHook();

  const generateBase64 = async (text: string): Promise<string> => {
    try {
      const response = await RNQRGenerator.generate({
        value: text,
        height: 200,
        width: 200,
        base64: true,
      });

      return `data:image/png;base64,${response.base64}`;
    } catch (err) {
      console.error("Error generando QR:", err);
      return "";
    }
  };

  const formatInvoiceDateOnly = (apiDate?: string): string => {
    if (!apiDate) return "";
    const date = new Date(apiDate);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const formatDatewithHMS = (apiDate?: string) => {
    if (!apiDate) return "";
    const date = new Date(apiDate);
    date.setMilliseconds(date.getMilliseconds() - 1);

    const dateOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    } as const;

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    } as const;

    const dateStr = date.toLocaleDateString("es-ES", dateOptions);
    const timeStr = date.toLocaleTimeString("es-ES", timeOptions);

    return `${dateStr} ${timeStr}`;
  };

  const printHtmlInvoice = async (invoice: string) => {
    await Print.printAsync({ html: invoice });
  };

  const buildElectronicInvoiceHtml = (
    ordenAImprimir: Order,
    tipoDeFactura: string,
    razonSocial: string,
    totalOrden: number,
    totalItbis: number,
    montoDescuento: number,
    qr: string,
    resultadoDgii: ResultadoDGII,
    companySelected: Company,
    branchSelected: Branch
  ): string => {
    const fechaEmision = formatInvoiceDateOnly(ordenAImprimir.dateHour);
    const subtotalGravado = totalOrden - totalItbis;
    const clienteNombre = ordenAImprimir.consumer?.name || "";
    const razon = razonSocial || "Consumidor Final";
    const clienteRnc = ordenAImprimir.rncOCedula || "";
    const clienteDireccion = ordenAImprimir.consumer?.address || "";
    const empresaTelefono = ordenAImprimir.consumer?.cellPhone || "";
    const logoSrc = companySelected.photo
      ? `data:image/png;base64,${companySelected.photo}`
      : "";
    const tieneCodigoSeguridad = !!resultadoDgii?.codigoSeguridad?.trim();
    const qrBlockA4Html = tieneCodigoSeguridad
      ? `
    <img src="${qr}" alt="QR DGII" />
    <div class="qr-meta">
      <p><strong>Código de Seguridad:</strong> ${resultadoDgii.codigoSeguridad}</p>
      <p><strong>Fecha de Firma Digital:</strong> ${formatDatewithHMS(resultadoDgii?.fechaFirma)}</p>
    </div>
  `
      : "";
    const qrBlockTirillaHtml = tieneCodigoSeguridad
      ? `<div class="qr-block-tirilla tirilla-only">
  <img src="${qr}" alt="QR DGII" />
  <div class="qr-meta">
    <p><strong>Código de Seguridad:</strong> ${resultadoDgii.codigoSeguridad}</p>
    <p><strong>Fecha de Firma Digital:</strong> ${formatDatewithHMS(resultadoDgii?.fechaFirma)}</p>
  </div>
</div>`
      : "";

    const productRowsA4 = (ordenAImprimir.products ?? [])
      .map((a) => {
        const precioUnitario = (a.productPrice ?? 0) - (a.itbis ?? 0);
        const totalItbisLinea = (a.itbis ?? 0) * (a.productAmount ?? 0);
        const montoTotal = (a.productPrice ?? 0) * (a.productAmount ?? 0);
        return `
        <tr>
          <td class="col-concepto">${a.productName}</td>
          <td class="col-cantidad">${a.productAmount}</td>
          <td class="col-monto">${formatCurrency(precioUnitario)}</td>
          <td class="col-monto">${formatCurrency(totalItbisLinea)}</td>
          <td class="col-monto">${formatCurrency(montoTotal)}</td>
        </tr>`;
      })
      .join("");

    const productRowsTirilla = (ordenAImprimir.products ?? [])
      .map((a) => {
        const precioUnitario = (a.productPrice ?? 0) - (a.itbis ?? 0);
        const totalItbisLinea = (a.itbis ?? 0) * (a.productAmount ?? 0);
        const montoTotal = (a.productPrice ?? 0) * (a.productAmount ?? 0);
        return `
        <div class="product-tirilla">
          <div class="product-tirilla-name">${a.productName}</div>
          <div class="product-tirilla-row">
            <span>Cant: ${a.productAmount}</span>
            <span>P.U: ${formatCurrency(precioUnitario)}</span>
          </div>
          <div class="product-tirilla-row">
            <span>ITBIS: ${formatCurrency(totalItbisLinea)}</span>
            <span>Total: ${formatCurrency(montoTotal)}</span>
          </div>
        </div>`;
      })
      .join("");

    const payWith = ordenAImprimir.payWith ?? 0;

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>${tipoDeFactura}</title>
<style>
  * { box-sizing: border-box; }

  body {
    margin: 0;
    padding: 16px 24px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: #000;
    line-height: 1.4;
  }

  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }

  .issuer-block {
    flex: 1;
    max-width: 55%;
  }

  .issuer-top {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .logo {
    width: 90px;
    flex-shrink: 0;
  }

  .logo img {
    width: 100%;
    height: auto;
    display: block;
  }

  .issuer-name {
    font-size: 15px;
    font-weight: bold;
    margin: 0 0 6px 0;
  }

  .issuer-details {
    margin: 0;
    font-size: 12px;
  }

  .doc-title-block {
    text-align: right;
    flex: 1;
    max-width: 42%;
  }

  .doc-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 8px 0;
    line-height: 1.25;
  }

  .doc-due-date {
    font-size: 12px;
    margin: 0;
  }

  .info-boxes {
    display: flex;
    gap: 16px;
    margin-bottom: 18px;
  }

  .info-box {
    flex: 1;
    border: 1.5px solid #000;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 12px;
  }

  .info-box p {
    margin: 0 0 6px 0;
  }

  .info-box p:last-child {
    margin-bottom: 0;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;
    font-size: 11px;
  }

  .items-table th,
  .items-table td {
    border: 1px solid #000;
    padding: 8px 6px;
  }

  .items-table th {
    font-weight: bold;
    text-align: center;
    background: #fff;
  }

  .col-concepto { text-align: left; width: 38%; }
  .col-cantidad { text-align: center; width: 10%; }
  .col-monto { text-align: right; width: 17%; }

  .footer-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-top: 10px;
  }

  .qr-block img {
    width: 110px;
    height: 110px;
    display: block;
  }

  .qr-meta {
    font-size: 10px;
    margin-top: 8px;
    max-width: 200px;
  }

  .qr-meta p {
    margin: 0 0 4px 0;
  }

  .totals-block {
    text-align: right;
    min-width: 220px;
  }

  .totals-block p {
    margin: 0 0 6px 0;
    font-size: 12px;
  }

  .totals-block .grand-total {
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;
  }

  .firma-section {
    display: flex;
    justify-content: space-around;
    margin-top: 36px;
    padding-top: 10px;
  }

  .firma {
    text-align: center;
    width: 40%;
    font-size: 12px;
  }

  .firma-line {
    border-top: 1px solid #000;
    margin-bottom: 6px;
    padding-top: 4px;
  }

  .tirilla-only { display: none; }

  .logo-tirilla {
    text-align: center;
    margin-bottom: 8px;
  }

  .logo-tirilla img {
    width: 70px;
    height: auto;
    display: inline-block;
  }

  .qr-block-tirilla {
    text-align: center;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed #000;
  }

  .qr-block-tirilla img {
    width: 90px;
    height: 90px;
    display: inline-block;
  }

  .payment-tirilla {
    border-top: 1px dashed #000;
    margin: 12px 0;
    padding-top: 10px;
    font-size: 11px;
  }

  .payment-tirilla p { margin: 0 0 4px 0; }

  .corte { page-break-inside: avoid; }

  @media print and (max-width: 80mm) {
    body {
      padding: 4px 6px;
      font-size: 10px;
    }

    .a4-only { display: none !important; }

    .tirilla-only { display: block !important; }

    .invoice-header {
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .issuer-block,
    .doc-title-block {
      max-width: 100%;
    }

    .doc-title-block { text-align: center; }

    .doc-title { font-size: 13px; }

    .info-boxes {
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .info-box {
      padding: 4px 0;
      border: none;
      border-radius: 0;
    }

    .footer-section {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }

    .totals-block {
      width: 100%;
      text-align: right;
      min-width: unset;
    }

    .product-tirilla {
      border-bottom: 1px dashed #ccc;
      padding: 6px 0;
    }

    .product-tirilla-name {
      font-weight: bold;
      margin-bottom: 3px;
    }

    .product-tirilla-row {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
    }

    .qr-block-tirilla .qr-meta {
      max-width: 100%;
      text-align: center;
      font-size: 9px;
      margin-top: 6px;
    }
  }

  @media print and (min-width: 81mm) {
    .tirilla-only { display: none !important; }
  }

  @media print {
    .corte { page-break-inside: avoid; }
  }
</style>
</head>
<body>

${
  logoSrc
    ? `<div class="logo-tirilla tirilla-only"><img src="${logoSrc}" alt="Logo" /></div>`
    : ""
}

<div class="invoice-header">
  <div class="issuer-block">
    <div class="issuer-top">
      ${
        logoSrc
          ? `<div class="logo a4-only"><img src="${logoSrc}" alt="Logo" /></div>`
          : ""
      }
      <div>
        <p class="issuer-name">${companySelected.name ?? ""}</p>
        <p class="issuer-details">
          ${branchSelected.address ?? ""}<br />
          RNC ${companySelected.rnc ?? ""}<br />
          
        </p>
      </div>
    </div>
  </div>
  <div class="doc-title-block">
    <p class="doc-title">${tipoDeFactura}</p>
  </div>
</div>

<div class="info-boxes">
  <div class="info-box">
    <p><strong>Cliente:</strong> ${clienteNombre}</p>
    <p><strong>RNC:</strong> ${clienteRnc}</p>
    <p><strong>Razon Social:</strong> ${razon}</p>
    <p><strong>Dirección:</strong> ${clienteDireccion}</p>
    <p><strong>Teléfono:</strong> ${empresaTelefono}</p>
  </div>
  <div class="info-box">
    <p><strong>Fecha de emisión:</strong> ${fechaEmision}</p>
    <p><strong>eNCF:</strong> ${ordenAImprimir.ncf ?? ""}</p>
    <p><strong>Vencimiento Secuencial:</strong> ${ordenAImprimir.fechaVencimientoSecuencia ?? ""}</p>
    <p><strong>Valor del NFC:</strong> ${formatCurrency(totalOrden)}</p>
    <p><strong>Forma Pago:</strong> ${ordenAImprimir.payMethod ?? ""}</p>
  </div>
</div>

<div class="a4-only">
  <table class="items-table">
    <thead>
      <tr>
        <th>Concepto</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Total Itbis</th>
        <th>Monto Total</th>
      </tr>
    </thead>
    <tbody>
      ${productRowsA4}
    </tbody>
  </table>
</div>

<div class="tirilla-only">
  ${productRowsTirilla}
</div>

<div class="footer-section">
<div class="qr-block a4-only">
  ${qrBlockA4Html}
  </div>
  <div class="totals-block">
    <p>Subtotal Gravado: ${formatCurrency(subtotalGravado)}</p>
    <p>Total ITBIS: ${formatCurrency(totalItbis)}</p>
    ${
      montoDescuento > 0
        ? `<p>Descuento: -${formatCurrency(montoDescuento)}</p>`
        : ""
    }
    <p class="grand-total">Total: ${formatCurrency(totalOrden)}</p>
  </div>
</div>

<div class="tirilla-only payment-tirilla">
  <p><strong>Forma de Pago:</strong> ${ordenAImprimir.payMethod ?? ""}</p>
  <p><strong>Pagó con:</strong> ${formatCurrency(payWith <= 0 ? 0 : payWith)}</p>
  <p><strong>Cambio:</strong> ${formatCurrency(payWith <= 0 ? 0 : payWith - totalOrden)}</p>
  <p><strong>Vendedor(a):</strong> ${ordenAImprimir.cajero ?? ""}</p>
</div>

${qrBlockTirillaHtml}

<div class="firma-section a4-only">
  <div class="firma">
    <div class="firma-line"></div>
    <div>Vendedor</div>
  </div>
  <div class="firma">
    <div class="firma-line"></div>
    <div>Comprador</div>
  </div>
</div>

<div class="corte"></div>
</body>
</html>`;
  };

  const printOrder = async (orden: Order, resultadoDgii: ResultadoDGII) => {
    try {
      const qr = await generateBase64(resultadoDgii?.urlCodigoQr ?? "");
      const ordenAImprimir = { ...orden };
      let totalOrden = 0;
      let totalItbis = 0;
      let razonSocial = "";
      let tipoDeFactura = "";
      let montoDescuento = 0;

      ordenAImprimir.products?.forEach((o) => {
        totalOrden +=
          (o.productPrice ?? 0) * (o.productAmount ?? 0) -
          getValuePercent(
            (o.productPrice ?? 0) * (o.productAmount ?? 0),
            o.discountPorcent ?? 0
          );
        totalItbis +=
          (o.itbis ?? 0) * (o.productAmount ?? 0) -
          getValuePercent(
            (o.itbis ?? 0) * (o.productAmount ?? 0),
            o.discountPorcent ?? 0
          );
        montoDescuento += o.totalDiscount ?? 0;
      });

      totalOrden -= getValuePercent(totalOrden, orden.discountPercent ?? 0);
      totalItbis -= getValuePercent(totalItbis, orden.discountPercent ?? 0);

      if ((ordenAImprimir.rncOCedula?.length ?? 0) >= 9) {
        tipoDeFactura = "Factura de Crédito Fiscal Electrónico";
        razonSocial = ordenAImprimir.razonSocial ?? "";
      } else {
        tipoDeFactura = "Factura de Consumo Electrónica";
      }

      const companySelected: Company = {
        name: company?.name,
        rnc: company?.rnc,
        photo: company?.photo,
      };
      const branchSelected: Branch = {
        address: branch?.address,
        cellPhone: branch?.cellPhone,
      };

      const invoice = buildElectronicInvoiceHtml(
        ordenAImprimir,
        tipoDeFactura,
        razonSocial,
        totalOrden,
        totalItbis,
        montoDescuento,
        qr,
        resultadoDgii,
        companySelected,
        branchSelected
      );

      await printHtmlInvoice(invoice);
    } catch (error) {
      console.error("Error al imprimir:", error);
      Alert.alert("Error", "No se pudo imprimir el documento");
    }
  };

  const rePrintOrder = async (orden: Order, resultadoDgii: ResultadoDGII) => {
    try {
      const ordenAImprimir = { ...orden };
      let totalOrden = 0;
      let totalItbis = 0;
      let razonSocial = "";
      let tipoDeFactura = "";
      let montoDescuento = 0;

      const qr = await generateBase64(resultadoDgii?.urlCodigoQr ?? "");

      ordenAImprimir.products?.forEach((o) => {
        totalOrden +=
          (o.productPrice ?? 0) * (o.productAmount ?? 0) -
          getValuePercent(
            (o.productPrice ?? 0) * (o.productAmount ?? 0),
            o.discountPorcent ?? 0
          );
        totalItbis +=
          (o.itbis ?? 0) * (o.productAmount ?? 0) -
          getValuePercent(
            (o.itbis ?? 0) * (o.productAmount ?? 0),
            o.discountPorcent ?? 0
          );
        montoDescuento += (o.totalDiscount ?? 0) * (o.productAmount ?? 0);
      });

      if ((ordenAImprimir.rncOCedula?.length ?? 0) >= 9) {
        tipoDeFactura = "Factura de Crédito Fiscal Electrónico";
        razonSocial = ordenAImprimir.razonSocial ?? "";
      } else {
        tipoDeFactura = "Factura de Consumo Electrónica";
      }

      const companySelected: Company = {
        name: company?.name,
        rnc: company?.rnc,
        photo: company?.photo,
      };
      const branchSelected: Branch = {
        address: branch?.address,
        cellPhone: branch?.cellPhone,
      };

      const invoice = buildElectronicInvoiceHtml(
        ordenAImprimir,
        tipoDeFactura,
        razonSocial,
        totalOrden,
        totalItbis,
        montoDescuento,
        qr,
        resultadoDgii,
        companySelected,
        branchSelected
      );

      await printHtmlInvoice(invoice);
    } catch (error) {
      console.error("Error al imprimir:", error);
      Alert.alert("Error", "No se pudo imprimir el documento");
    }
  };

  return { printOrder, rePrintOrder };
};
