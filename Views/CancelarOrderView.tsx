import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { CancelOrder } from "@/Models/CancelOrder";
import { ChangePassword } from "@/Models/ChangePassword";
import { Order } from "@/Models/Order";
import { User } from "@/Models/User";
import OrderService from "@/Services/Order/OrderService";
import UserService from "@/Services/User/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import Toast from "react-native-toast-message";

const CancelarOrderView = () => {
  const navigation = useNavigation();
  const { userData, updateUser, branch } = useUserContext();
  const theme = useColorScheme();

  const [error, setError] = useState<string>("");
  const [errorIsActive, setErrorIsActive] = useState<boolean>(false);
  const [motivo, setMotivo] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const route = useRoute();
  const { order }: { order: Order } = route.params;

  useEffect(() => {
    if (userData?.roleName == "Admin") {
      setCodigo(userData.authCode!);
    }
  }, []);

  const handleSave = () => {
    const cancelar: CancelOrder = {
      orderId: order.id,
      motivo: motivo,
      authCode: codigo,
      branchId: branch?.id,
    };

    console.log(userData);

    OrderService.CancelOrder(cancelar)
      .then((e: any) => {
        console.log(e.data);

        if (e.data.success) {
          ToastAndroid.show("Cancelada con Exito!", ToastAndroid.SHORT);
          navigation.goBack();

        } else {
          ToastAndroid.show("Error al cancelar!", ToastAndroid.SHORT);
          setErrorIsActive(true);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const commonTextStyle = {
    color:
      theme === "light"
        ? Colors.light.colors.primary
        : Colors.dark.colors.primary,
  };
  return (
    <>
      <View style={styles.container}>
        <Toast />
        <View style={styles.form}>
          {/* Client Section */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={[styles.label, commonTextStyle]}>Cliente: </Text>
              <Text style={[styles.boldText, commonTextStyle]}>
                {order.consumer?.name}
              </Text>
            </View>

            {/* Date Section */}
            <View style={styles.row}>
              <Text style={commonTextStyle}>Fecha:</Text>
              <Text style={styles.dateText}>
                {new Date(order.dateHour!).toLocaleDateString("es-DO")}
              </Text>
            </View>

            {/* Payment Method Section */}
            <View style={styles.row}>
              <Text style={commonTextStyle}>Metodo de pago:</Text>
              <Text style={styles.paymentMethodText}>{order.payMethod}</Text>
            </View>

            {/* Products Count Section */}
            <View style={styles.row}>
              <Text style={[styles.label, commonTextStyle]}>
                Cantidad de productos:
              </Text>
              <Text style={styles.productCountText}>
                {order.products!.length} producto(s)
              </Text>
            </View>

            {/* Total Section */}
            <View style={styles.row}>
              <Text style={[styles.label, commonTextStyle]}>
                Total de la orden:
              </Text>
              <Text style={styles.totalText}>
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
            </View>
          </View>

          {userData?.roleName != "Admin" && (
            <>
              <Text>Codigo</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=" Codigo"
                  placeholderTextColor="gray"
                  onChangeText={(text) => {
                    setCodigo(text);
                  }}
                  value={codigo}
                />
              </View>
            </>
          )}

          <Text>Motivo</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputArea}
              multiline={true}
              placeholder=" Motivo"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setMotivo(text);
              }}
              value={motivo}
            />
          </View>

          {errorIsActive && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  form: {
    width: "90%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  input: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    color: "black",
  },
  inputArea: {
    height: 80,
    flex: 1,
    paddingHorizontal: 10,
    color: "black",
  },
  iconContainer: {
    padding: 10,
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  text: {
    fontSize: 17,
    paddingTop: 5,
    paddingLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
  paymentMethodText: {
    fontSize: 12,
    color: "#27ae60",
    fontWeight: "bold",
    marginLeft: 5,
  },
  productCountText: {
    fontSize: 14,
    color: "#555",
  },
  totalText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
  },
  avatar: {
    marginRight: 10,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productAmount: {
    fontSize: 14,
    marginLeft: 5,
  },
});

export default CancelarOrderView;
