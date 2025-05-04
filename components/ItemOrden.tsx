import { Colors } from "@/constants/Colors";
import { usePrintHook } from "@/hooks/usePrintHook";
import { Order } from "@/Models/Order";
import { useNavigation } from "expo-router";
import { View, TouchableOpacity, Text, useColorScheme } from "react-native";
import { Icon } from "react-native-paper";

export const ItemOrden = ({ orden }: { orden: Order }) => {
  const theme = useColorScheme();
  const navigation = useNavigation();
  const { rePrintOrder } = usePrintHook();

  const OrdenDetails = (order: Order) => {
    navigation.navigate(
      "DetailsOrderView" as never,
      {
        order: order,
      } as never
    );
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor:
          theme === "light"
            ? Colors.light.colors.background
            : Colors.dark.colors.background,
        padding: 15,
        marginBottom: 10,
      }}
      onPress={() => OrdenDetails(orden)}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <Image style={{ width: 40, height: 40, marginRight: 10 }}  /> */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#27ae60", fontWeight: "bold" }}>
            {orden.payMethod}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color:
                theme === "light"
                  ? Colors.light.colors.primary
                  : Colors.dark.colors.primary,
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            {orden.consumer!.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color:
                theme === "light"
                  ? Colors.light.colors.primary
                  : Colors.dark.colors.primary,
            }}
          >
            RD${" "}
            {orden
              .products!.reduce((total, item) => total + item.productTotal!, 0)
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}{" "}
            • {orden.products!.length} producto(s)
          </Text>
          <Text
            style={{
              fontSize: 12,
              color:
                theme === "light"
                  ? Colors.light.colors.primary
                  : Colors.dark.colors.primary,
              marginTop: 5,
            }}
          >
            {new Date(orden.dateHour!).toLocaleDateString("es-DO")}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
            flexDirection: "row",
          }}
        >
          <Icon source="trash-can-outline" size={20} color={"blank"} />
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#3F75EA",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
            flexDirection: "row",
          }}
          onPress={() => rePrintOrder(orden)}
        >
          <Icon source="printer" size={20} color={"blank"} />
          <Text>Imprimir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
