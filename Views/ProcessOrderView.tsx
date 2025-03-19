import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  useColorScheme,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Switch, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as Print from "expo-print";
import { Button, Surface, Portal, Modal, Provider } from "react-native-paper";
import { useNavigation } from "expo-router";
import ConsumerService from "@/Services/CommonServices/ConsumerService";
import { Consumer } from "@/Models/Consumer";
import ChargingApp from "@/components/CharginApp";
import { Discount } from "@/Models/Discount";
import DiscountService from "@/Services/CommonServices/DiscountService";
import { useRoute } from "@react-navigation/native";
import ItemProduct from "@/components/ItemProduct";
import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
import OrderS from "@/Services/Order/OrderService";
import { Order } from "@/Models/Order";
import { Company } from "@/Models/Company";
import { Branch } from "@/Models/Branch";
const ScreenHeight = Dimensions.get("window").height;

const ProcessOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedProducts }: any = route.params;
  const [consumer, setConsumer] = useState<Consumer[]>([]);
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [checking, setChecking] = useState<boolean>(true);

  const [descuentos, setDescuentos] = useState<number>(0);
  const [itebis, setItebis] = useState<number>(0);
  const { company, userData, branch } = useUserContext();

  const [descuento, setDescuento] = useState(null);
  const [cliente, setCliente] = useState<Consumer>({});
  const [rncOrCedula, setRncOrCedula] = React.useState("");
  const [hasRnc, setHasRnc] = React.useState(false);
  const onToggleSwitch = () => setHasRnc(!hasRnc);

  useEffect(() => {
    ConsumerService.getAll(company?.id!)

      .then((e: any) => {
        const data = e.data.data;
        setConsumer(data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });

    DiscountService.getAll(company?.id!)
      .then((e: any) => {
        const data = e.data.data;

        setDiscount(data.filter((x) => x.type == 1));
        console.log(discount);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  const verifyClientInformation = (client: any) => {
    setHasRnc(client.hasRnc);
    setRncOrCedula(client.rncOCedula);
    setCliente(client);
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total: number, item: any) => {
      return total + item.cantidad * item.product.price;
    }, 0);
  };
  const CrearOrden = () => {
    setChecking(true);
    const newOrdenProducts = selectedProducts.map((p) => ({
      productId: p.id,
      productName: p.product.name,
      productAmount: p.cantidad,
      productPrice: p.product.price,
      productCode: p.product.code,
      itbis: p.product.itbis,
      totalDiscount: 0,
      discountPorcent: 0,
    }));
    const newOrden: Order = {
      consumer: {
        id: cliente?.id ?? 0, // Valor por defecto si es null/undefined
        name: cliente?.name ?? "", // Valor por defecto si es null/undefined
        address: cliente?.address ?? "",
        cellPhone: cliente?.cellPhone ?? "",
      },
      rncOCedula: rncOrCedula,
      branchId: branch!,
      razonSocial: "",
      companyId: company?.id!,
      payMethod: "Efectivo",
      discountPercent: 0,
      byDelivery: false,
      toCaja: false,
      deliveryId: 0,
      total: 0,
      payWith: 0,
      hasComprobante: hasRnc,
      products: newOrdenProducts,
    };

    console.log(newOrden);
    OrderS.create(newOrden)
      .then((e: any) => {
        setChecking(false);
        printOrder(newOrden)
        navigation.navigate(
          "initalApp" as never,
          {
            selectedProducts: selectedProducts,
          } as never
        );
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const printOrder = async(orden: Order) => {
    var ordenAImprimir = { ...orden };
    var totalOrden = 0;
    var totalItbis = 0;
    var razonSocial = "";
    var tipoDeFactura = "";
    var montoDescuento = 0;

    try{
    ordenAImprimir.products.forEach((o) => {
      totalOrden +=
        o.productPrice * o.productAmount -
        gerPercent(o.productPrice * o.productAmount, o.discountPorcent);
      totalItbis +=
        o.itbis * o.productAmount -
        gerPercent(o.itbis * o.productAmount, o.discountPorcent);
      montoDescuento += o.totalDiscount;
    });

    const companySelected: Company = {
      name: company?.name,
      rnc: company?.rnc,
    };
    const branchSelected: Branch = {
      address: "calle el sol",
      cellPhone: "829-751-8951",
    };

    totalOrden -= gerPercent(totalOrden, orden.discountPercent);

    totalItbis -= gerPercent(totalItbis, orden.discountPercent);

    if (ordenAImprimir.rncOCedula.length >= 9) {
      tipoDeFactura = "CON CRÉDITO FISCAL";
      razonSocial = `Razon Social: ${ordenAImprimir.razonSocial}<br />`;
    } else {
      tipoDeFactura = "PARA CONSUMIDOR FINAL";
    }

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

<br />Vendedor(a): ${ordenAImprimir.cajero}
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
  return (
    <Provider>
      {checking ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ChargingApp />
        </View>
      ) : (
        <View
          style={[
            styles.scrollContainer,
            {
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.colors.background
                    : Colors.dark.colors.background,
              },
            ]}
          >
            {/* Dropdown de Clientes */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={consumer}
              search
              maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder="Clientes"
              searchPlaceholder="Buscar..."
              value={descuento}
              onChange={(item) => verifyClientInformation(item)}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="user"
                  size={20}
                />
              )}
            />

            {/* Switch de Comprobante Fiscal */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Comprobante Fiscal</Text>
              <Switch value={hasRnc} onValueChange={onToggleSwitch} />
            </View>

            {/* Campo de RNC o Cédula */}
            {hasRnc ? (
              <TextInput
                label="RNC o Cédula"
                value={rncOrCedula}
                style={styles.input}
                onChangeText={(text) => setRncOrCedula(text)}
              />
            ) : (
              <View></View>
            )}

            {/* Dropdown de Descuentos */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={discount}
              search
              maxHeight={300}
              labelField="name"
              valueField="valor"
              placeholder="Descuentos"
              searchPlaceholder="Buscar..."
              value={descuento}
              onChange={(item) => setDescuento(item.value)}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="tag"
                  size={20}
                />
              )}
            />

            {/* Título de Productos */}
            <Text style={styles.sectionTitle}>Productos</Text>

            {/* Lista de Productos */}
            <Surface
              style={[
                styles.surface,
                {
                  backgroundColor:
                    theme === "light"
                      ? Colors.light.colors.background
                      : Colors.dark.colors.background,
                },
              ]}
            >
              <FlatList
                data={selectedProducts}
                style={{ height: ScreenHeight - 600, marginBottom: 10 }}
                renderItem={({ item, index }) => (
                  <ItemProduct
                    key={index}
                    product={item.product}
                    add={() => {}}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </Surface>
            {/* Switch de Comprobante Fiscal */}
            <View style={styles.montosContainer}>
              <View
                style={{
                  display: "flex",
                  padding: 10,
                  borderTopWidth: 1,
                  borderColor: "gray",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor:
                      theme === "light"
                        ? Colors.light.colors.background
                        : Colors.dark.colors.background,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    Cantidad de productos:
                  </Text>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    {selectedProducts.length}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor:
                      theme === "light"
                        ? Colors.light.colors.background
                        : Colors.dark.colors.background,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#333",
                      fontWeight: "bold",
                      marginLeft: 93,
                    }}
                  >
                    Descuento:
                  </Text>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    RD$ {descuentos}.00
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor:
                      theme === "light"
                        ? Colors.light.colors.background
                        : Colors.dark.colors.background,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#333",
                      fontWeight: "bold",
                      marginLeft: 133,
                    }}
                  >
                    Itebis:
                  </Text>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    RD$ {itebis}.00
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor:
                      theme === "light"
                        ? Colors.light.colors.background
                        : Colors.dark.colors.background,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#333",
                      fontWeight: "bold",
                      marginLeft: 138,
                    }}
                  >
                    Total:
                  </Text>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    RD$ {getTotalPrice()}.00
                  </Text>
                </View>
              </View>
            </View>
            {/* Botones de Acción */}
            <View style={styles.buttonContainer}>
              <Button
                icon="cancel"
                mode="contained"
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: "red" }}
              >
                Cancelar
              </Button>
              <Button
                icon="check"
                mode="contained"
                onPress={() => CrearOrden()}
                style={{ backgroundColor: "#3F75EA" }}
              >
                Procesar
              </Button>
            </View>
          </View>
        </View>
      )}
    </Provider>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  dropdown: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  montosContainer: {
    // display: "flex",
    // backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  montos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  surface: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 300,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
  },
  icon: {
    marginRight: 5,
  },
});

export default ProcessOrderView;
