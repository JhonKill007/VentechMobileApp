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
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Avatar, List, Switch, TextInput } from "react-native-paper";
// import Toast from "react-native-toast-message";
import * as Print from "expo-print";
import { Button, Surface, Provider } from "react-native-paper";
import { useNavigation } from "expo-router";
import ConsumerService from "@/Services/Common/ConsumerService";
import { Consumer } from "@/Models/Consumer";
import ChargingApp from "@/components/CharginApp";
import { Discount } from "@/Models/Discount";
import DiscountService from "@/Services/Common/DiscountService";
import { useRoute } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
import OrderS from "@/Services/Order/OrderService";
import { Order } from "@/Models/Order";
import { Company } from "@/Models/Company";
import { Branch } from "@/Models/Branch";
import { Badge } from "react-native-paper";
import ItemOrdenProduct from "@/components/ItemOrdenProduct";
import { Icon } from "react-native-paper";
import { SelectProduct } from "@/Models/SelectProduct";
import { InfoOrder } from "@/Models/InfoOrder";

const ScreenHeight = Dimensions.get("window").height;

// interface IProcessOrderRouteParams {}

const ProcessOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {
    selectedProducts,
    infoOrder,
  }: { selectedProducts: SelectProduct[]; infoOrder: InfoOrder } = route.params;
  const [consumer, setConsumer] = useState<Consumer[]>([]);
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [checking, setChecking] = useState<boolean>(true);

  const [descuentos, setDescuentos] = useState<number>(0);
  const [itebis, setItebis] = useState<number>(0);
  const [razonSocial, setRazonSocial] = useState<string>("");
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

        setDiscount(data.filter((x: any) => x.type == 1));
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

  const getRNC = (rncOrCedula: string) => {
    ConsumerService.GetContribuyente(rncOrCedula!)
      .then((e: any) => {
        const data = e.data.data;
        setRazonSocial(data.razonSocial);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const CrearOrden = () => {
    setChecking(true);
    const newOrdenProducts = selectedProducts.map((p: any) => ({
      productId: p.id,
      productName: p.product.name,
      productAmount: p.cantidad,
      productPrice: p.product.price,
      productCode: p.product.code,
      itbis: gerPercent(p.product.price, p.product.itbis),
      totalDiscount: 0,
      discountPorcent: 0,
    }));

    let totalOrden = 0;
    newOrdenProducts.forEach((o: any) => {
      totalOrden +=
        o.productPrice * o.productAmount -
        gerPercent(o.productPrice * o.productAmount, o.discountPorcent);
    });

    const currentDate = new Date(); // Obtener la fecha y hora actual
    const formattedDate = currentDate.toLocaleString(); // Formatear la fecha y hora

    const newOrden: Order = {
      consumer: {
        id: infoOrder.clientId ?? 0, // Valor por defecto si es null/undefined
        name: infoOrder.clientName ?? "", // Valor por defecto si es null/undefined
        address: cliente?.address ?? "",
        cellPhone: cliente?.cellPhone ?? "",
      },
      rncOCedula: infoOrder.rnc,
      branchId: branch?.id!,
      razonSocial: infoOrder.razonSocial,
      companyId: company?.id!,
      payMethod: infoOrder.metodoPago,
      discountPercent: infoOrder.descuento ?? 0,
      byDelivery: false,
      toCaja: false,
      deliveryId: 0,
      total: 0,
      dateHour: formattedDate,
      payWith: totalOrden,
      hasComprobante: infoOrder.rnc ? true : false,
      products: newOrdenProducts,
    };

    OrderS.create(newOrden)
      .then((e: any) => {
        newOrden.ncf = e.data.data;

        setChecking(false);
        printOrder(newOrden);
        navigation.reset({
          index: 0,
          routes: [{ name: "initalApp" as never }],
        });
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const printOrder = async (orden: Order) => {
    var ordenAImprimir = { ...orden };
    var totalOrden = 0;
    var totalItbis = 0;
    var razonSocial = "";
    var tipoDeFactura = "";
    var montoDescuento = 0;

    try {
      ordenAImprimir.products!.forEach((o) => {
        totalOrden +=
          o.productPrice! * o.productAmount! -
          gerPercent(o.productPrice! * o.productAmount!, o.discountPorcent);
        totalItbis += o.itbis! * o.productAmount!;

        montoDescuento += o.totalDiscount!;
      });

      const companySelected: Company = {
        name: company?.name,
        rnc: company?.rnc,
      };
      const branchSelected: Branch = {
        address: branch?.address!,
        cellPhone: branch?.cellPhone!,
      };

      totalOrden -= gerPercent(totalOrden, orden.discountPercent);

      totalItbis -= gerPercent(totalItbis, orden.discountPercent);

      if (ordenAImprimir.rncOCedula!.length >= 9) {
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
                  ${branchSelected?.address ?? ""}
                  <br />TEL:${branchSelected?.cellPhone ?? ""} <br />RNC:
                  ${companySelected.rnc} <br />NCF: ${ordenAImprimir?.ncf ?? ""}
                  <br />Fecha: ${ordenAImprimir.dateHour}
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
                  ${ordenAImprimir
                    .products!.map(
                      (a) => `
                  <tr>
                    <td style="border: none">${a.productName} * ${
                        a.productAmount
                      }</td>
                    <td style="border: none">
                      ${(a.itbis! * a.productAmount!).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td style="border: none">
                      ${(a.productPrice! * a.productAmount!).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </td>
                  </tr>
                  `
                    )
                    .join("")}
                </table>
              </div>
              <hr />
              <div class="section totals">
                <p>
                  subtotal: ${(totalOrden - totalItbis).toLocaleString(
                    "en-US",
                    { style: "currency", currency: "USD" }
                  )}
                </p>
                <p>
                  itbis: ${totalItbis.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p>
                  Descuento: -${montoDescuento.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p>
                  Total: ${totalOrden.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <hr />
              <div class="section">
                <p>
                  Forma de Pago: ${ordenAImprimir.payMethod} <br />Pagó con:
                  ${(ordenAImprimir.payWith! <= 0
                    ? 0
                    : ordenAImprimir.payWith!
                  ).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                  <br />Cambio: ${(ordenAImprimir.payWith! <= 0
                    ? 0
                    : ordenAImprimir.payWith! - totalOrden
                  ).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
          
                  <br />Vendedor(a): ${userData?.fullName}
                </p>
              </div>
              <hr />
              <div style="text-align: center">
                <span>DATOS DEL CLIENTE</span>
              </div>
              <hr />
          
              <p>
                ${
                  orden.rncOCedula!.length > 0
                    ? `RNC/Cedula: ${orden.rncOCedula} <br />
                ${razonSocial} `
                    : ""
                } Cliente:${ordenAImprimir.consumer!.name}
                <br />Tel: ${
                  ordenAImprimir.consumer!.cellPhone
                } <br />Dirección:
                ${ordenAImprimir.consumer!.address}
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

  // const formatDate = (apiDate: any) => {
  //   const date = new Date(apiDate);
  //   const options = {
  //     year: "2-digit",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     hour12: true,
  //   } as const;
  //   return date.toLocaleString("es-ES", options);
  // };

  const gerPercent = (amount: any, percent: any) => {
    return (amount * percent) / 100;
  };

  const getTotalItbis = () => {
    return selectedProducts.reduce((total: number, item: any) => {
      return (
        total +
        ((item.product.price * item.product.itbis) / 100) * item.cantidad
      );
    }, 0);
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total: number, item: any) => {
      return total + item.cantidad * item.product.price;
    }, 0);
  };
  const getTotalCantidadProducto = () => {
    return selectedProducts.reduce((total: number, item: any) => {
      return total + item.cantidad;
    }, 0);
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
          style={{
            flex: 1,
            padding: 10,
            backgroundColor:
              theme === "light"
                ? Colors.light.colors.background
                : Colors.dark.colors.background,
          }}
        >
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 2,
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                Cliente:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 2,
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {infoOrder.clientName}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                Comprobante fiscal:
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginTop: 1,
                  marginLeft: 5,
                }}
              >
                {infoOrder.rnc}
              </Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: "#555" }}>
                <Text
                  style={{
                    color:
                      theme === "light"
                        ? Colors.light.colors.primary
                        : Colors.dark.colors.primary,
                  }}
                >
                  Descuento:
                </Text>{" "}
                {infoOrder.descuento + "%"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                Metodo de pago:
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#27ae60",
                  fontWeight: "bold",
                  marginTop: 2,
                  marginLeft: 5,
                }}
              >
                {infoOrder.metodoPago}
              </Text>
            </View>

            {/* <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                Total de la orden:
              </Text>
              <Text style={{ fontSize: 14, color: "#555", marginLeft: 5 }}>
                RD${" "}
                {order
                  .products!.reduce(
                    (total, item) => total + item.productTotal!,
                    0
                  )
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
              </Text>
            </View> */}
          </View>
          {/* Título de Productos */}
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 5,
                color:
                  theme === "light"
                    ? Colors.light.colors.primary
                    : Colors.dark.colors.primary,
              }}
            >
              Productos
            </Text>

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
                style={{
                  height: ScreenHeight - 510,
                  marginBottom: 5,
                }}
                renderItem={({ item, index }) => (
                  <ItemOrdenProduct OrdenItem={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
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
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                      fontWeight: "bold",
                    }}
                  >
                    Cantidad de productos:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                    }}
                  >
                    {getTotalCantidadProducto()}
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
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                      fontWeight: "bold",
                      marginLeft: 133,
                    }}
                  >
                    Itebis:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                    }}
                  >
                    RD${" "}
                    {getTotalItbis().toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
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
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                      fontWeight: "bold",
                      marginLeft: 138,
                    }}
                  >
                    Total:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                    }}
                  >
                    RD${" "}
                    {getTotalPrice().toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Text>
                </View>
              </View>
            </Surface>
          </View>

          {/* Botones de Acción */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Button
              icon="arrow-left"
              mode="contained"
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: "orange" }}
            >
              Atras
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
      )}
    </Provider>
  );
};
const styles = StyleSheet.create({
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
  montos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  surface: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 5,
  },
  scrollView: {
    maxHeight: 300,
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
