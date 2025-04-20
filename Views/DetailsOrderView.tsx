import { Colors } from "@/constants/Colors";
import { Order } from "@/Models/Order";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, FlatList, useColorScheme } from "react-native";
import { Avatar, Badge, List } from "react-native-paper";
import { Icon, MD3Colors } from "react-native-paper";

export const DetailsOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const { order }: { order: Order } = route.params;
  return (
    <View>
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
            {order.consumer?.name ? order.consumer?.name : NaN}
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
            Fecha:
          </Text>

          <Text
            style={{ fontSize: 12, color: "#888", marginTop: 1, marginLeft: 5 }}
          >
            {new Date(order.dateHour!).toLocaleDateString("es-DO")}
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
            {order.payMethod}
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
              Cantidad de productos:
            </Text>{" "}
            {order.products!.length} producto(s)
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
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
              .products!.reduce((total, item) => total + item.productTotal!, 0)
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 2,
          color:
            theme === "light"
              ? Colors.light.colors.primary
              : Colors.dark.colors.primary,
        }}
      >
        Productos:
      </Text>
      <FlatList
        data={order.products}
        renderItem={({ item, index }) => (
          <List.Item
            title={item.productName!}
            description={`RD$${item.productPrice}`}
            titleStyle={{
              color:
                theme === "light"
                  ? Colors.light.colors.primary
                  : Colors.dark.colors.primary,
            }}
            left={(props) => (
              <Avatar.Text
                {...props}
                style={{
                  backgroundColor:
                    theme === "light"
                      ? Colors.light.colors.background
                      : Colors.dark.colors.background,
                }}
                color={
                  theme === "light"
                    ? Colors.light.colors.primary
                    : Colors.dark.colors.primary
                }
                label={item.productName!.charAt(0)}
              />
            )}
            right={() => (
              <View style={{ flexDirection: "row", marginTop: 25 }}>
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
                  Cantidad:
                </Text>
                <Text
                  style={{
                    color:
                      theme === "light"
                        ? Colors.light.colors.primary
                        : Colors.dark.colors.primary,
                    marginTop: 2,
                    marginLeft: 5,
                  }}
                >
                  {item.productAmount}
                </Text>
              </View>
            )}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
