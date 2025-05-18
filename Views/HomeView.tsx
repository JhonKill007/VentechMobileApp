import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";

import { Button, Surface, Provider, Searchbar } from "react-native-paper";
import Products from "@/Services/Products/ProductsService";
import { Product } from "@/Models/Product";
import ItemProduct, { ItemProductRef } from "@/components/ItemProduct";
import ChargingApp from "@/components/CharginApp";
import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
import { SelectProduct } from "@/Models/SelectProduct";
import { useCountHook } from "../hooks/useCountHook";
const ScreenHeight = Dimensions.get("window").height;

const HomeView = () => {
  const theme = useColorScheme();
  const { getTotalItbis, getTotalPrice, getTotalCantidadProducto } =
    useCountHook();
  const { branch, company } = useUserContext();
  const [products, setProducts] = useState<Product[]>([]);
  // const [newOrder, setNewOrder] = useState<Order>({});
  const [productsFiltered, setProductsFiltered] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectProduct[]>([]);
  const [search, setsearch] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(true);
  const [descuentos, setDescuentos] = useState<number>(0);
  const [itebis, setItebis] = useState<number>(0);
  const [reset, setReset] = useState<boolean>(false);
  const navigation = useNavigation();

  const itemProductRef = useRef<Record<string, ItemProductRef | null>>({});
  const [listHeight, setListHeight] = useState(0);

  const handleReset = () => {
    Object.values(itemProductRef.current).forEach((ref) => {
      ref?.reset(); // solo si existe
    });
  };

  useEffect(() => {
    Products.getAll(branch?.id!)
      .then((e: any) => {
        const data = groupAndSumStock(e.data.data);
        setProducts(data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [branch]);

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout; // Alto del contenedor
    setListHeight(height); // Guarda el alto disponible
  };

  const groupAndSumStock = (products: Product[]): Product[] => {
    const groupedProducts = products.reduce((acc, product) => {
      const key = `${product.code}-${product.name}`;

      acc[key] = acc[key]
        ? { ...acc[key], stock: acc[key].stock! + product.stock! }
        : { ...product };

      return acc;
    }, {} as { [key: string]: Product });

    return Object.values(groupedProducts);
  };

  const SearchHandle = (text: string) => {
    setsearch(text);
    const filteredProduct = products.filter((p: Product) =>
      p.name!.toLowerCase().includes(text.toLowerCase())
    );
    setProductsFiltered(filteredProduct);
  };

  const addProducts = (id: number, product: Product, cantidad: number) => {
    // product.itbis = desglosarPrecioConImpuesto(product.price!, product.itbis!);
    setSelectedProducts((prevProducts: SelectProduct[]) => {
      const existingProductIndex = prevProducts.findIndex(
        (p: SelectProduct) => p.id === id
      );
      if (existingProductIndex !== -1) {
        if (cantidad === 0) {
          return prevProducts.filter((p: SelectProduct) => p.id !== id);
        }
        return prevProducts.map((p: SelectProduct) =>
          p.id === id ? { ...p, cantidad } : p
        );
      } else {
        return cantidad > 0
          ? [{ id, product, cantidad }, ...prevProducts]
          : prevProducts;
      }
    });
  };

  const aggInfoOrder = () => {
    navigation.navigate(
      "InfoOrderView" as never,
      {
        selectedProducts: selectedProducts,
      } as never
    );
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
          <Searchbar
            onChangeText={SearchHandle}
            value={search}
            style={{
              borderColor: "#3F75EA",
              borderWidth: 1,
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
              marginBottom: 10,
            }}
          />
          <Surface
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              marginBottom: 70,
              elevation: 4,
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
            }}
            onLayout={onLayout}
          >
            <FlatList
              data={!search ? products : productsFiltered}
              style={{ marginBottom: 130 }}
              renderItem={({ item, index }) => (
                <ItemProduct
                  ref={(ref) => {
                    itemProductRef.current[item.id!] = ref;
                  }}
                  key={index}
                  product={item}
                  add={addProducts}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </Surface>

          <View
            style={{
              
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
              borderTopWidth: 1,
              borderTopColor: "#ddd",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 35,
            }}
          >
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
                    marginLeft: 93,
                  }}
                >
                  Descuento:
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
                  {descuentos.toLocaleString("en-US", {
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
                  {getTotalItbis(selectedProducts).toLocaleString("en-US", {
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
                  {getTotalPrice(selectedProducts).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </View>
            </View>
            <View  style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
             
            }}>
              <Button
                icon="trash-can-outline"
                mode="contained"
                textColor="white"
                onPress={() => {
                  setSelectedProducts([]);
                  handleReset();
                }}
                style={{ backgroundColor: "red" }}
              >
                Limpiar
              </Button>

              <Button
                icon="arrow-right"
                mode="contained"
                textColor="white"
                onPress={() =>
                  selectedProducts.length > 0 ? aggInfoOrder() : null
                }
                style={{ backgroundColor: "#3F75EA" }}
              >
                Siguiente
              </Button>
            </View>
          </View>
        </View>
      )}
    </Provider>
  );
};
const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
});
export default HomeView;
