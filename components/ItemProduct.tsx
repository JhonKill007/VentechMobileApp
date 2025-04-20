import { Colors } from "@/constants/Colors";
import { Product } from "@/Models/Product";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { Avatar, List } from "react-native-paper";

interface IItemProduct {
  product: Product;
  add: Function;
  // reset: boolean;
}

export type ItemProductRef = {
  reset: () => void;
};

const ItemProduct = forwardRef<ItemProductRef, IItemProduct>(
  ({ product, add }, ref) => {
    const theme = useColorScheme();
    const [cantidad, setCantidad] = useState<number>(0);

    const sumarCant = () => {
      add(product.id, product, cantidad + 1);
      setCantidad(cantidad + 1);
    };

    const restarCant = () => {
      if (cantidad > 0) {
        add(product.id, product, cantidad - 1);
        setCantidad(cantidad - 1);
      }
    };

    useImperativeHandle(ref, () => ({
      reset() {
        setCantidad(0);
      },
    }));

    // useEffect(() => {
    //   if (reset) {
    //     setCantidad(0);
    //   }
    // }, [reset]);

    return (
      <List.Item
        title={product.name!}
        description={`RD$${product.price}`}
        left={(props) =>
          product.photo ? (
            <Avatar.Image
              {...props}
              style={{
                backgroundColor:
                  theme === "light"
                    ? Colors.light.colors.background
                    : Colors.dark.colors.background,
              }}
              source={{ uri: "data:image/png;base64," + product.photo }}
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
              label={product.name!.charAt(0)}
            />
          )
        }
        right={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: -23,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#3F75EA",
                padding: 8,
                borderRadius: 25,
                //   marginHorizontal: 5,
                width: 40,
                height: 40,
              }}
              onPress={restarCant}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginTop: 1,
                  textAlign: "center",
                }}
              >
                -
              </Text>
            </TouchableOpacity>
            <View style={{ width: 25 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {cantidad}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#3F75EA",
                padding: 8,
                borderRadius: 25,
                //   marginHorizontal: 5,
                width: 40,
                height: 40,
              }}
              onPress={sumarCant}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginTop: 1,
                  textAlign: "center",
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  }
);

export default ItemProduct;
