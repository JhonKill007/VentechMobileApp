import React, { useEffect, useMemo, useState } from "react";
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
import ItemProduct from "@/components/ItemProduct";
import ChargingApp from "@/components/CharginApp";
import { Colors } from "@/constants/Colors";
import { Order } from "@/Models/Order";
import { useUserContext } from "@/context/UserContext/UserContext";
const ScreenHeight = Dimensions.get("window").height;

const HomeView = () => {
  const { branch, token } = useUserContext();
  const theme = useColorScheme();
  const [products, setProducts] = useState<Product[]>([]);
  // const [newOrder, setNewOrder] = useState<Order>({});
  const [productsFiltered, setProductsFiltered] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [search, setsearch] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(true);
  const [descuentos, setDescuentos] = useState<number>(0);
  const [itebis, setItebis] = useState<number>(0);
  const navigation = useNavigation();

  useEffect(() => {
    Products.getAll(branch!, token!)
      .then((e: any) => {
        const data = groupAndSumStock(e.data.data);
        setProducts(data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [branch]);

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
    console.log(text);
    const filteredProduct = products.filter((p: Product) =>
      p.name!.includes(text.toUpperCase())
    );
    setProductsFiltered(filteredProduct);
  };

  const addProducts = (id: number, product: Product, cantidad: number) => {
    setSelectedProducts((prevProducts: any) => {
      const existingProductIndex = prevProducts.findIndex(
        (p: any) => p.id === id
      );
      if (existingProductIndex !== -1) {
        if (cantidad === 0) {
          return prevProducts.filter((p: any) => p.id !== id);
        }
        return prevProducts.map((p: any) =>
          p.id === id ? { ...p, cantidad } : p
        );
      } else {
        return cantidad > 0
          ? [{ id, product, cantidad }, ...prevProducts]
          : prevProducts;
      }
    });
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total: number, item: any) => {
      return total + item.cantidad * item.product.price;;
    }, 0);
  };

  const procesarOrden = () => {
    navigation.navigate(
      "ProcessOrderView" as never,
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
              padding: 10,
              borderRadius: 10,
              elevation: 4,
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
            }}
          >
            <FlatList
              data={!search ? products : productsFiltered}
              style={{ height: ScreenHeight - 400, marginBottom: 10 }}
              renderItem={({ item, index }) => (
                <ItemProduct key={index} product={item} add={addProducts} />
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
          </Surface>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button
              icon="trash-can-outline"
              mode="contained"
              onPress={() => setSelectedProducts([])}
              style={{ backgroundColor: "red" }}
            >
              Limpiar
            </Button>

            <Button
              icon="check"
              mode="contained"
              onPress={() =>
                selectedProducts.length > 0 ? procesarOrden() : null
              }
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
  icon: {
    marginRight: 5,
  },
});
export default HomeView;
