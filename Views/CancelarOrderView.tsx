import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
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
  useColorScheme,
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


    OrderService.CancelOrder(cancelar)
      .then((e: any) => {

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
    color: theme === 'light' ? Colors.light.colors.primary : Colors.dark.colors.primary,
  };
  return (
    <View style={styles.container}>
      <Toast />
      <View style={styles.form}>
  
        {/* Información del cliente */}
        <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={[styles.label, commonTextStyle]}>Cliente:</Text>
                  <Text style={[styles.value, commonTextStyle]}>{order.consumer?.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, commonTextStyle]}>NCF:</Text>
                  <Text style={[styles.value, commonTextStyle]}>{order.ncf}</Text>
                </View>
          
                <View style={styles.row}>
                  <Text style={[styles.label, commonTextStyle]}>Fecha:</Text>
                  <Text style={[styles.label, commonTextStyle]}>
                    {new Date(order.dateHour!).toLocaleDateString('es-DO')}
                  </Text>
                </View>
          
                <View style={styles.row}>
                  <Text style={[styles.label, commonTextStyle]}>Método de pago:</Text>
                  <Text style={styles.paymentMethodText}>{order.payMethod}</Text>
                </View>
          
                <View style={styles.row}>
                  <Text style={[styles.label, commonTextStyle]}>Cantidad de productos:</Text>
                  <Text style={[styles.label, commonTextStyle]}>{order.products!.length} producto(s)</Text>
                </View>
          
                <View style={[styles.row, styles.totalRow]}>
                  <Text style={[styles.label, commonTextStyle]}>Total:</Text>
                  <Text style={styles.totalText}>
                    RD
                    {order.products!
                      .reduce((total, item) => total + item.productTotal!, 0)
                      .toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                  </Text>
                </View>
              </View>
  
        {/* Campos adicionales para no admins */}
        {userData?.roleName !== "Admin" && (
          <View style={{ marginBottom: 30,
            paddingBottom: 10,}}>
            <Text style={[styles.label, commonTextStyle]}>Código</Text>
            <TextInput
              style={styles.input}
              placeholder="Código"
              placeholderTextColor="gray"
              onChangeText={setCodigo}
              value={codigo}
            />
          </View>
        )}
  
        {/* Motivo */}
        <View style={{ marginBottom: 30,
    paddingBottom: 10,}}>
          <Text style={[styles.label, commonTextStyle]}>Motivo</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="Motivo de la cancelación"
            placeholderTextColor="gray"
            multiline
            onChangeText={setMotivo}
            value={motivo}
          />
        </View>
  
        {/* Error */}
        {errorIsActive && <Text style={styles.errorText}>{error}</Text>}
  
        {/* Botón */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Cancelar Orden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  form: {
    width: "90%",
  },
  section: {
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  productCountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
   
  },
  totalText: {
    fontSize: 16,
    color: '#1b1fb2',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  productItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  avatar: {
    marginRight: 10,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: "#27ae60",
    height: 30,
    padding: 5,
  },
  productAmount: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '600',
    
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "black",
    backgroundColor: "#f9f9f9",
  },
  inputArea: {
    height: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    color: "black",
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#e53935",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CancelarOrderView;
