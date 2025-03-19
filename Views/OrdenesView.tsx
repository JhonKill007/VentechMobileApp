import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { Avatar, List, Surface, Provider, Icon, Portal, Modal, Button } from "react-native-paper";
import OrderService from "@/Services/Order/OrderService";

import * as Print from "expo-print";
import { Order } from "@/Models/Order";
import { Branch } from "@/Models/Branch";
import { Company } from "@/Models/Company";
import { useUserContext } from "@/context/UserContext/UserContext";

const OrdenesView = () => {
  const { branch, token } = useUserContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [checking, setChecking] = useState<boolean>(true);
    const [visible, setVisible] = useState(false);
  
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  useEffect(() => {
    OrderService.getAll(2, token!)
      .then((e: any) => {
        const data = e.data.data;
        console.log(data);

        setOrders(data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  const rePrintOrder = async (orden: Order) => {
    try {
      var ordenAImprimir = { ...orden };
      var totalOrden = 0;
      var totalItbis = 0;
      var razonSocial = "";
      var tipoDeFactura = "";
      var montoDescuento = 0;
      console.log(ordenAImprimir);

      ordenAImprimir.products!.forEach((o) => {
        totalOrden +=
          o.productPrice * o.productAmount -
          gerPercent(o.productPrice * o.productAmount, o.discountPorcent);
        totalItbis +=
          o.itbis * o.productAmount -
          gerPercent(o.itbis * o.productAmount, o.discountPorcent);
        montoDescuento += o.totalDiscount * o.productAmount;
      });

      if (ordenAImprimir.rncOCedula.length >= 9) {
        tipoDeFactura = "CON CRÉDITO FISCAL";
        razonSocial = `Razon Social: ${ordenAImprimir.razonSocial}<br />`;
      } else {
        tipoDeFactura = "PARA CONSUMIDOR FINAL";
      }
      const companySelected: Company = {
        name: "Countech Solutions",
        rnc: "133-12764-4",
      };
      const branchSelected: Branch = {
        address: "calle el sol",
        cellPhone: "829-751-8951",
      };

      var invoice = `<!DOCTYPE html>
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
<br />NCF: ${ordenAImprimir.ncf} 
<br />Fecha: ${formatDate(ordenAImprimir.dateHour)}
</p>
<hr />
<div style="text-align: center">

<span style="font-weight: bold">FACTURA ${tipoDeFactura}</span>
</div>
<hr />
</div>
<div class="section">
<table style="border: none; width: 100%;">
<tr>
<th style="border: none;">Descripción</th>
<th style="border: none;">itbis</th>
<th style="border: none;">valor</th>
</tr>
${ordenAImprimir.products
  .map(
    (a) => `
  <tr>
    <td style="border: none;">${a.productName} * ${a.productAmount}</td>
    <td style="border: none;">${(a.itbis * a.productAmount).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    )}</td>
    <td style="border: none;">${(
      a.productPrice * a.productAmount
    ).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
    </tr>
`
  )
  .join("")}
</table>
</div>
<hr />
<div class="section totals">
<p>subtotal: ${(totalOrden - totalItbis).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</p>
<p>itbis: ${totalItbis.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</p>
<p>Descuento: -${montoDescuento.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</p>
<p>Total: ${totalOrden.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</p>

</div>
<hr />
<div class="section">

<p>Forma de Pago: ${ordenAImprimir.payMethod}
<br />Pagó con: ${(ordenAImprimir.payWith <= 0
        ? 0
        : ordenAImprimir.payWith
      ).toLocaleString("en-US", { style: "currency", currency: "USD" })}
<br />Cambio: ${(ordenAImprimir.payWith <= 0
        ? 0
        : ordenAImprimir.payWith - totalOrden
      ).toLocaleString("en-US", { style: "currency", currency: "USD" })}

<br />Cajero(a): ${ordenAImprimir.cajero}
</p>
</div>
<hr />
<div style="text-align: center">
<span>DATOS DEL CLIENTE</span>
</div>
<hr />

<p>
${
  orden.rncOCedula.length > 0
    ? `RNC/Cedula: ${orden.rncOCedula} <br />
${razonSocial} `
    : ""
}
Cliente:${ordenAImprimir.consumer.name}
<br />Tel: ${ordenAImprimir.consumer.cellPhone}
<br />Dirección: ${ordenAImprimir.consumer.address}</p>
<div class="corte"></div>
</body>
</html>`;

      await Print.printAsync({ html: invoice });
    } catch (error) {
      console.error("Error al imprimir:", error);
      Alert.alert("Error", "No se pudo imprimir el documento");
    }
  };

  const formatDate = (apiDate) => {
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

  const gerPercent = (amount, percent) => {
    return (amount * percent) / 100;
  };

  const PedidoItem = ({ orden }) => {
    console.log(orden);

    return (
      <Provider>
        
      <View  style={styles.card}>
      <TouchableOpacity onPress={showModal} activeOpacity={0.8}>
        <View style={styles.row}>
          <Image style={styles.logo} />
          <View style={styles.info}>
            <Text style={styles.estado}>{orden.payMethod}</Text>
            <Text style={styles.restaurante}>{orden.consumer.name}</Text>
            <Text style={styles.detalles}>
              RD${" "}
              {orden.products
                .reduce((total, item) => total + item.productTotal, 0) // Sumar los precios
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
              • {orden.products.length} producto(s)
            </Text>
            <Text style={styles.fecha}>{formatDate(orden.dateHour)}</Text>
          </View>
        </View>
        </TouchableOpacity>
        {/* Modal */}
        <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={styles.modalContainer}
              >
                <Button mode="contained" onPress={hideModal}>
                  Cerrar
                </Button>
              </Modal>
            </Portal>

        <View style={styles.botones}>
          <TouchableOpacity style={styles.button}>
            <Icon source="trash-can-outline" size={20} color={"blank"} />
            <Text>Cancelar</Text>
          </TouchableOpacity>
          <Text
            style={{
              borderEndWidth: 1,
              borderStartWidth: 1,
              borderColor: "gray",
            }}
          ></Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => rePrintOrder(orden)}
          >
            <Icon source="printer" size={20} color={"blank"} />
            <Text>Imprimir</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      </Provider>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id?.toString()!}
        renderItem={({ item }) => <PedidoItem orden={item} />}
      />
    </View>
    
  );
};

const styles = {
  button: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cerrado: { color: "#d35400", fontWeight: "bold", marginBottom: 5 },
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 10 },
  info: { flex: 1 },
  estado: { fontSize: 12, color: "#27ae60", fontWeight: "bold" },
  restaurante: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  detalles: { fontSize: 14, color: "#555" },
  fecha: { fontSize: 12, color: "#888", marginTop: 5 },
  botones: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "gray",
  },
  opinar: { color: "#2980b9", fontWeight: "bold" },
  repetir: { color: "#27ae60", fontWeight: "bold" },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
  },
};


export default OrdenesView;
