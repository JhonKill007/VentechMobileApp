import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Switch, TextInput } from "react-native-paper";

import { Button, Surface, Portal, Modal, Provider } from "react-native-paper";
import { useNavigation } from "expo-router";
import ConsumerService from "@/Services/CommonServices/ConsumerService";
import { Consumer } from "@/Models/Consumer";
import ChargingApp from "@/components/CharginApp";
import { Discount } from "@/Models/Discount";
import DiscountService from "@/Services/CommonServices/DiscountService";
import { useRoute } from "@react-navigation/native";
import ItemProduct from "@/components/ItemProduct";
import { Colors } from "@/constants/Colors";
const ScreenHeight = Dimensions.get("window").height;

const ProcessOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedProducts }: any = route.params;
  const [visible, setVisible] = useState(false);
  const [consumer, setConsumer] = useState<Consumer[]>([]);
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [checking, setChecking] = useState<boolean>(true);

  const [descuentos, setDescuentos] = useState<number>(0);
  const [itebis, setItebis] = useState<number>(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [value, setValue] = useState(null);
  const [rncOrCedula, setRncOrCedula] = React.useState("");
  const [hasRnc, setHasRnc] = React.useState(false);
  const onToggleSwitch = () => setHasRnc(!hasRnc);

  useEffect(() => {
    ConsumerService.getAll(2)
      .then((e: any) => {
        const data = e.data.data;

        setConsumer(data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });

    DiscountService.getAll(2)
      .then((e: any) => {
        const data = e.data.data;
        setDiscount(data.filter((x) => x.type == 1));
        console.log(discount);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  const verifyClientInformation = (client: any) => {
    setHasRnc(client.hasRnc);
    setRncOrCedula(client.rncOCedula);
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total: number, item: any) => {
      return total + item.cantidad * item.product.price;
    }, 0);
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
          style={[
            styles.scrollContainer,
            {
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.colors.background
                    : Colors.dark.colors.background,
              },
            ]}
          >
            {/* Dropdown de Clientes */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={consumer}
              search
              maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder="Clientes"
              searchPlaceholder="Buscar..."
              value={value}
              onChange={(item) => verifyClientInformation(item)}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="user"
                  size={20}
                />
              )}
            />

            {/* Switch de Comprobante Fiscal */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Comprobante Fiscal</Text>
              <Switch value={hasRnc} onValueChange={onToggleSwitch} />
            </View>

            {/* Campo de RNC o Cédula */}
            {hasRnc ? (
              <TextInput
                label="RNC o Cédula"
                value={rncOrCedula}
                style={styles.input}
                onChangeText={(text) => setRncOrCedula(text)}
              />
            ) : (
              <View></View>
            )}

            {/* Dropdown de Descuentos */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={discount}
              search
              maxHeight={300}
              labelField="name"
              valueField="valor"
              placeholder="Descuentos"
              searchPlaceholder="Buscar..."
              value={value}
              onChange={(item) => setValue(item.value)}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="tag"
                  size={20}
                />
              )}
            />

            {/* Título de Productos */}
            <Text style={styles.sectionTitle}>Productos</Text>

            {/* Lista de Productos */}
            <Surface
              style={[
                styles.surface,
                {
                  backgroundColor:
                    theme === "light"
                      ? Colors.light.colors.background
                      : Colors.dark.colors.background,
                },
              ]}
            >
              <FlatList
                data={selectedProducts}
                style={{ height: ScreenHeight - 600, marginBottom: 10 }}
                renderItem={({ item, index }) => (
                  <ItemProduct
                    key={index}
                    product={item.product}
                    add={() => {}}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </Surface>
            {/* Switch de Comprobante Fiscal */}
            <View style={styles.montosContainer}>
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
            </View>
            {/* Botones de Acción */}
            <View style={styles.buttonContainer}>
              <Button
                icon="cancel"
                mode="contained"
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: "red" }}
              >
                Cancelar
              </Button>
              <Button
                icon="check"
                mode="contained"
                onPress={showModal}
                style={{ backgroundColor: "#3F75EA" }}
              >
                Procesar
              </Button>
            </View>

            {/* Modal */}
            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={styles.modalContainer}
              >
                <Button mode="contained" onPress={hideModal}>
                  Cerrar
                </Button>
              </Modal>
            </Portal>
          </View>
        </View>
      )}
    </Provider>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  dropdown: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  montosContainer: {
    // display: "flex",
    // backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  montos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  surface: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 300,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
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
