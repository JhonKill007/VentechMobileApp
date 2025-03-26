import { Colors } from "@/constants/Colors";
import { SelectProduct } from "@/Models/SelectProduct";
import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { Avatar, List } from "react-native-paper";

interface IItemOrdenProduct {
  OrdenItem: SelectProduct;
}

const ItemOrdenProduct = ({ OrdenItem }: IItemOrdenProduct) => {
  const theme = useColorScheme();
  return (
    <List.Item
      title={OrdenItem.product?.name}
      description={`RD$${OrdenItem.product!.price}`}
      left={(props) =>
        OrdenItem.product?.photo ? (
          <Avatar.Image
            {...props}
            style={{
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
            }}
            source={{
              uri: "data:image/png;base64," + OrdenItem.product.photo,
            }}
          />
        ) : (
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
            label={OrdenItem.product?.name!.charAt(0)!}
          />
        )
      }
      right={() => (
        <View
          style={{
            marginRight: -20,
            marginTop: 20,
            borderRadius: 25,
            backgroundColor: "red",
            height: 30,
            padding: 5,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Cant: {OrdenItem.cantidad}</Text>
        </View>
      )}
    />
  );
};

export default ItemOrdenProduct;
