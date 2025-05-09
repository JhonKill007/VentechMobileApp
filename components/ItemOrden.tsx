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
        backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginLeft: 5,
        marginRight: 5,
      }}
      onPress={() => OrdenDetails(orden)}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Ícono o imagen (puedes activar esto si tienes una imagen de usuario o empresa) */}
        {/* <Image source={...} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} /> */}

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, color: "#10b981", fontWeight: "600" }}>
            {orden.payMethod}
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: theme === "light" ? "#1f2937" : "#f3f4f6",
              fontWeight: "700",
              marginTop: 2,
            }}
          >
            {orden.consumer!.name}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: theme === "light" ? "#4b5563" : "#d1d5db",
              marginTop: 2,
            }}
          >
            {orden.products!.length} producto(s) •{" "}
            {orden
              .products!.reduce((total, item) => total + item.productTotal!, 0)
              .toLocaleString("es-DO", {
                style: "currency",
                currency: "DOP",
              })}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: theme === "light" ? "#6b7280" : "#9ca3af",
              marginTop: 6,
            }}
          >
            {new Date(orden.dateHour!).toLocaleString("es-DO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#ef4444",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
          onPress={() =>
            navigation.navigate(
              "CancelarOrderView" as never,
              {
                order: orden,
              } as never
            )
          }
        >
          <Icon source="trash-can-outline" size={18} color={"white"} />
          <Text style={{ color: "white", marginLeft: 6 }}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => rePrintOrder(orden)}
        >
          <Icon source="printer" size={18} color={"white"} />
          <Text style={{ color: "white", marginLeft: 6 }}>Imprimir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
