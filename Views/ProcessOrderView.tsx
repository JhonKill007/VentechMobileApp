import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Button, Surface, Provider } from "react-native-paper";
import { useNavigation } from "expo-router";
import ChargingApp from "@/components/CharginApp";
import { useRoute } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
import OrderS from "@/Services/Order/OrderService";
import { Order } from "@/Models/Order";
import ItemOrdenProduct from "@/components/ItemOrdenProduct";
import { SelectProduct } from "@/Models/SelectProduct";
import { InfoOrder } from "@/Models/InfoOrder";
import { useCountHook } from "@/hooks/useCountHook";

import { usePrintHook } from "@/hooks/usePrintHook";

const ScreenHeight = Dimensions.get("window").height;

const ProcessOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {
    selectedProducts,
    infoOrder,
  }: { selectedProducts: SelectProduct[]; infoOrder: InfoOrder } = route.params;

  const [checking, setChecking] = useState<boolean>(false);

  const { company, branch } = useUserContext();
  const [mensajeCredito, setMensajeCredito] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    getValuePercent,
    getTotalItbis,
    getTotalPrice,
    getTotalCantidadProducto,
    getTotalItbisSingle,
  } = useCountHook();
  const { printOrder } = usePrintHook();



  useEffect(() => {
    if (infoOrder.metodoPago === "Crédito") {
      const total = getTotalPrice(selectedProducts, infoOrder.descuento);
      if (total <= infoOrder.credito!) {
        setIsDisabled(false);
        setMensajeCredito("Total de Créditos Disponibles: " + infoOrder.credito);
      } else {
        setIsDisabled(true);
        setMensajeCredito("Créditos Insuficientes: " + infoOrder.credito);
      }
    }
  }, [infoOrder, selectedProducts]);

  
  const CrearOrden = () => {
    setChecking(true);
    const newOrdenProducts = selectedProducts.map((p: SelectProduct) => ({
      productId: p.id,
      productName: p.product!.name,
      productAmount: p.cantidad,
      productPrice: p.product?.price,
      productCode: p.product!.code,
      itbis: getTotalItbisSingle(p.product!.price!, p.product!.itbis!),
      totalDiscount: getValuePercent(p.product!.price!, infoOrder.descuento!),
      discountPorcent: infoOrder.descuento,
    }));

    let totalOrden = 0;
    newOrdenProducts.forEach((o: any) => {
      totalOrden +=
        o.productPrice * o.productAmount -
        getValuePercent(o.productPrice * o.productAmount, o.discountPorcent);
    });

    const currentDate = new Date(); // Obtener la fecha y hora actual
    const formattedDate = currentDate.toLocaleString(); // Formatear la fecha y hora

    const newOrden: Order = {
      consumer: {
        id: infoOrder.clientId ?? 0, // Valor por defecto si es null/undefined
        name: infoOrder.clientName ?? "", // Valor por defecto si es null/undefined
        address: "",
        cellPhone: "",
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
      total: getTotalPrice(selectedProducts, infoOrder.descuento),
      dateHour: formattedDate,
      payWith: getTotalPrice(selectedProducts, infoOrder.descuento),
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

            <View style={{ flexDirection: "row"}}>
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
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text
                style={{
                  fontSize: 12,
                  color: "#27ae60",
                  fontWeight: "bold",
                  marginTop: 2,
                
                }}
              >
                {mensajeCredito}
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
                  //cambiar aqui el height
                  height: ScreenHeight - 610,
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
                    {getTotalCantidadProducto(selectedProducts)}
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
                    DOP{" "}
                    {getTotalItbis(
                      selectedProducts,
                      infoOrder.descuento!
                    ).toLocaleString("en-US", {
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
                    DOP{" "}
                    {getTotalPrice(
                      selectedProducts,
                      infoOrder.descuento!
                    ).toLocaleString("en-US", {
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
              disabled={isDisabled}
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
