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
import { useCountHook } from "@/Hooks/useCountHook";

import { usePrintHook } from "@/Hooks/usePrintHook";
import ProductsService from "@/Services/Products/ProductsService";
import { Discount } from "@/Models/Discount";
import { Product } from "@/Models/Product";
import { OrderProduct } from "@/Models/OrderProduct";
import { green } from "react-native-reanimated/lib/typescript/Colors";


const ProcessOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {
    selectedProducts,
    infoOrder,
  }: { selectedProducts: SelectProduct[]; infoOrder: InfoOrder } = route.params;

  const [checking, setChecking] = useState<boolean>(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const { company, branch, userData } = useUserContext();
  const [mensajeCredito, setMensajeCredito] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [listHeight, setListHeight] = useState(0);

  const {
    getValuePercent,
    getTotalItbis,
    getTotalPrice,
    getTotalCantidadProducto,
    getTotalItbisSingle,
  } = useCountHook();
  const { printOrder } = usePrintHook();

  useEffect(() => {
    const fetchAndCheckCredit = async () => {
      await GetAllDiscount();

      if (infoOrder.metodoPago === "Crédito") {
        const total = getTotalPrice(selectedProducts, infoOrder.descuento);
        if (total <= infoOrder.credito!) {
          setIsDisabled(false);
          setMensajeCredito(
            "Total de Créditos Disponibles: " + infoOrder.credito
          );
        } else {
          setIsDisabled(true);
          setMensajeCredito(
            "Créditos Insuficientes: " + (infoOrder.credito ?? 0.0)
          );
        }
      }
    };

    fetchAndCheckCredit();
  }, [infoOrder, selectedProducts]);

  const GetAllDiscount = async () => {
    try {
      const e = await ProductsService.getAllDiscount(company?.id!);
      if (e.data.success) {
        setDiscounts(e.data.data);

        for (const prod of selectedProducts) {
          const Promotion = e.data.data.find(
            (d: any) => d.type === 3 && d.productsId!.includes(prod.id)
          );

          if (selectedProducts.filter((x) => x.id == prod.id).length >= 2) {
          } else {
            if (Promotion && prod.cantidad! >= Promotion.amount!) {
              const newProduct: Product = {
                id: prod.id,
                name: prod.product?.name,
                price: 0,
                code: prod.product?.code,
                itbis: 0,
              };

              const selectedProduc: SelectProduct = {
                cantidad: 1,
                product: newProduct,
                id: prod.id,
              };

              selectedProducts.push(selectedProduc);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout; // Alto del contenedor
    setListHeight(height); // Guarda el alto disponible
  };
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
    const formattedDate = currentDate.toLocaleString("es-DO"); // Formatear la fecha y hora

    const newOrden: Order = {
      consumer: {
        id: infoOrder.clientId , // Valor por defecto si es null/undefined
        name: infoOrder.clientName ?? "", // Valor por defecto si es null/undefined
        address: infoOrder.clientAddress,
        cellPhone: infoOrder.clientCellPhone,
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
      cajero: userData?.fullName,
      total: getTotalPrice(selectedProducts, infoOrder.descuento),
      dateHour: formattedDate,
      payWith: getTotalPrice(selectedProducts, infoOrder.descuento),
      hasComprobante: infoOrder.rnc ? true : false,
      products: newOrdenProducts,
    };

    console.log(newOrden);
    

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
          <View style={{ paddingLeft: 20, paddingTop:20 }}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                  marginLeft: 3,
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
            {infoOrder.rnc && infoOrder.rnc !== "null" && (
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                RNC:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 3,
                  marginBottom: 2,
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {infoOrder.rnc}
              </Text>
            </View>
            )}

            {infoOrder.razonSocial && infoOrder.razonSocial !== "null" && (
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                Razón social:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 3,
                  marginBottom: 2,
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {infoOrder.razonSocial}
              </Text>
            </View>

)}
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                Descuento:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 3,
                  marginBottom: 2,
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {infoOrder.descuento + "%"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                Monto Total:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 3,
                  marginBottom: 2,
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {getTotalPrice(selectedProducts).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                Método de pago:
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 3,
                  marginBottom: 2,
                  color: "#27ae60",
                }}
              >
                {infoOrder.metodoPago}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
          </View>

          <View style={{ flex: 1 }}>
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
            <Surface
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                elevation: 4,
                backgroundColor:
                  theme === "light"
                    ? Colors.light.colors.background
                    : Colors.dark.colors.background,
              }}
            >
              {/* FlatList que se adapta al espacio disponible */}
              <FlatList
                data={selectedProducts}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => <ItemOrdenProduct OrdenItem={item} />}
                keyExtractor={(item, index) => index.toString()}
              />

              {/* Info de productos */}
              <View
                style={{ padding: 10, borderTopWidth: 1, borderColor: "gray" }}
              ></View>
            </Surface>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 10,
                left: 0,
                right: 0,
                padding: 16,
                backgroundColor:
                  theme === "light"
                    ? Colors.light.colors.background
                    : Colors.dark.colors.background,
              }}
            >
              <Button
                icon="arrow-left"
                mode="contained"
                textColor="white"
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: "orange" }}
              >
                Atras
              </Button>
              <Button
                icon="check"
                textColor="white"
                mode="contained"
                disabled={isDisabled}
                onPress={() => CrearOrden()}
                style={{ backgroundColor: "#3F75EA" }}
              >
                Procesar
              </Button>
            </View>
          </View>

          {/* <View
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
                textColor="white"
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: "orange" }}
            >
              Atras
            </Button>
            <Button
              icon="check"
              textColor="white"
              mode="contained"
              disabled={isDisabled}
              onPress={() => CrearOrden()}
              style={{ backgroundColor: "#3F75EA" }}
            >
              Procesar
            </Button>
          </View> */}
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
