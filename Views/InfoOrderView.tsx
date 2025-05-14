import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  RadioButton,
  Switch,
  IconButton,
  MD3Colors,
} from "react-native-paper";
import { Button, Provider } from "react-native-paper";
import { useNavigation } from "expo-router";
import ConsumerService from "@/Services/Common/ConsumerService";
import { Consumer } from "@/Models/Consumer";
import ChargingApp from "@/components/CharginApp";
import { Discount } from "@/Models/Discount";
import DiscountService from "@/Services/Common/DiscountService";
import { useRoute } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useUserContext } from "@/context/UserContext/UserContext";
import { Icon } from "react-native-paper";
import { SelectProduct } from "@/Models/SelectProduct";
import { InfoOrder } from "@/Models/InfoOrder";

export const InfoOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedProducts }: { selectedProducts: SelectProduct[] } =
    route.params;
  const { company, branch } = useUserContext();
  const [consumer, setConsumer] = useState<Consumer[]>([]);
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [checking, setChecking] = useState<boolean>(true);
  const [formCliente, setFormCliente] = useState<boolean>(false);

  const [razonSocial, setRazonSocial] = useState<string>("");

  const [descuento, setDescuento] = useState<number>(0);
  const [cliente, setCliente] = useState<Consumer>({});
  const [rncOrCedula, setRncOrCedula] = useState<string>("");
  const [hasRnc, setHasRnc] = useState<boolean>(false);

  const [payMetho, setPayMetho] = useState<string>("Efectivo");
  const [clientName, setClientName] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  const [clientCell, setClientCell] = useState<string>("");

  useEffect(() => {
    ConsumerService.getAll(company?.id!)

      .then((e: any) => {
        const data = e.data.data;
        setConsumer(data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });

    DiscountService.getAll(company?.id!)
      .then((e: any) => {
        const data = e.data.data;

        setDiscount(data.filter((x: any) => x.type == 1));
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  const onToggleSwitch = () => setHasRnc(!hasRnc);

  const verifyClientInformation = (client: any) => {
    setHasRnc(client.hasRnc);
    setRncOrCedula(client.rncOCedula);
    setCliente(client);
    if (client.hasRnc) {
      getRNC(client.rncOCedula);
    }
  };

  const getRNC = (rncOrCedula: string) => {
    ConsumerService.GetContribuyente(rncOrCedula!)
      .then((e: any) => {
        const data = e.data.data;
        setRazonSocial(data.razonSocial);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };
  const commonTextStyle = {
    color:
      theme === "light"
        ? Colors.light.colors.primary
        : Colors.dark.colors.primary,
  };
  const setMetodoPago = (valor: string) => {
    setPayMetho(valor);

    if (valor == "Crédito") {
    }
  };
  const viewOrdenDetails = () => {

    if(cliente.id!>0){
        cliente.cellPhone = consumer.find(x=>x.id == cliente.id)?.cellPhone;
        cliente.address = consumer.find(x=>x.id == cliente.id)?.address;
    }
    const infoOrden: InfoOrder = {
      clientId: formCliente? 0: cliente.id,
      clientName: formCliente? clientName:cliente.name,
      clientCellPhone: formCliente? clientCell:cliente.cellPhone,
      clientAddress: formCliente? clientAddress:cliente.address,
      rnc: rncOrCedula,
      razonSocial,
      descuento,
      metodoPago: payMetho,
      credito: cliente.credito,
    };

    navigation.navigate(
      "ProcessOrderView" as never,
      {
        selectedProducts: selectedProducts,
        infoOrder: infoOrden,
      } as never
    );
  };
  const getFormCliente = () => {
    setFormCliente(!formCliente);
  };

  const formasDePago = [
    {
      value: "Efectivo",
    },
    {
      value: "Tarjeta",
    },
    {
      value: "Crédito",
    },
  ];

  return (
    <Provider>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        {checking ? (
          <View style={styles.centered}>
            <ChargingApp />
          </View>
        ) : (
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
            <View style={{ flexDirection: "row" }}>
              <Dropdown
                style={[styles.dropdown_cliente, getThemeBackground(theme!)]}
                placeholderStyle={styles.placeholderText}
                selectedTextStyle={styles.selectedText}
                inputSearchStyle={styles.inputSearch}
                iconStyle={styles.icon}
                data={consumer}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder="Clientes"
                searchPlaceholder="Buscar..."
                value={cliente}
                onChange={(item) => verifyClientInformation(item)}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.iconMargin}
                    color={getPrimaryColor(theme!)}
                    name="user"
                    size={20}
                  />
                )}
              />

              {formCliente ? (
                <IconButton
                  icon="close"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={() => getFormCliente()}
                />
              ) : (
                <IconButton
                  icon="account-plus"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={() => getFormCliente()}
                />
              )}
            </View>

            {formCliente && (
              <View style={styles.form}>
                <Text style={commonTextStyle}>Nombre</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, commonTextStyle]}
                    placeholder="Nombre Completo"
                    placeholderTextColor="gray"
                    onChangeText={(text) => {
                      setClientName(text);
                    }}
                    value={clientName}
                  />
                </View>
                <Text style={commonTextStyle}>Teléfono</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, commonTextStyle]}
                    placeholder="Teléfono"
                    placeholderTextColor="gray"
                    onChangeText={(text) => {
                      setClientCell(text);
                    }}
                    value={clientCell}
                  />
                </View>
                <Text style={commonTextStyle}>Dirección </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, commonTextStyle]}
                    placeholder="Dirección"
                    placeholderTextColor="gray"
                    onChangeText={(text) => {
                      setClientAddress(text);
                    }}
                    value={clientAddress}
                  />
                </View>
              </View>
            )}
            {/* Switch de Comprobante Fiscal */}
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: getPrimaryColor(theme) }]}>
                Comprobante Fiscal
              </Text>
              <Switch value={hasRnc} onValueChange={onToggleSwitch} />
            </View>

            {/* Campo de RNC o Cédula */}
            {hasRnc && (
              <View style={styles.rncContainer}>
                <TextInput
                  label="RNC o Cédula"
                  value={rncOrCedula}
                  style={[styles.input, getThemeBackground(theme)]}
                  onChangeText={(text) => {
                    setRncOrCedula(text);
                    if (text.length >= 9) getRNC(text);
                  }}
                />
                <Text
                  style={[
                    styles.razonSocial,
                    { color: getPrimaryColor(theme) },
                  ]}
                >
                  {razonSocial}
                </Text>
                {rncOrCedula.length >= 9 && (
                  <TouchableOpacity
                    onPress={() => {
                      setRncOrCedula("");
                      setRazonSocial("");
                    }}
                  >
                    <Icon
                      source="close"
                      color={getPrimaryColor(theme)}
                      size={30}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Dropdown de Descuentos */}
            <View style={styles.section}>
              <Dropdown
                style={[styles.dropdown, getThemeBackground(theme)]}
                placeholderStyle={styles.placeholderText}
                selectedTextStyle={styles.selectedText}
                inputSearchStyle={styles.inputSearch}
                data={discount}
                search
                maxHeight={300}
                labelField="name"
                valueField="valor"
                placeholder="Descuentos"
                searchPlaceholder="Buscar..."
                value={descuento}
                onChange={(item) => setDescuento(item.valor)}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.iconMargin}
                    color={getPrimaryColor(theme)}
                    name="tag"
                    size={20}
                  />
                )}
              />
            </View>

            {/* Métodos de Pago */}
            <View style={styles.paymentSection}>
              <Text
                style={[styles.paymentTitle, { color: getPrimaryColor(theme) }]}
              >
                Metodos de pago
              </Text>
              {formasDePago.map((f: any, key: number) => (
                <TouchableOpacity
                  key={key}
                  style={styles.paymentOption}
                  onPress={() => setMetodoPago(f.value)}
                >
                  <RadioButton
                    color={getPrimaryColor(theme)}
                    value={f.value}
                    status={payMetho === f.value ? "checked" : "unchecked"}
                    onPress={() => setMetodoPago(f.value)}
                  />
                  <Text
                    style={[
                      styles.paymentText,
                      { color: getPrimaryColor(theme) },
                    ]}
                  >
                    {f.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botones */}
            <View style={styles.footer}>
              <Button
                icon="arrow-left"
                mode="contained"
                textColor="white"
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: "orange" }}
              >
                Atrás
              </Button>
              <Button
                icon="arrow-right"
                mode="contained"
                textColor="white"
                onPress={viewOrdenDetails}
                style={{ backgroundColor: "#3F75EA" }}
              >
                Siguiente
              </Button>
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    </Provider>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 10,
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
  dropdown_cliente: {
    width: "90%",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  dropdown: {
    width: "100%",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedText: {
    fontSize: 16,
    color: "#27ae60",
  },
  inputSearch: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconMargin: {
    marginRight: 5,
  },
  switchContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
  },
  rncContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  input: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    color: "black",
  },
  razonSocial: {
    marginRight: 10,
  },
  section: {
    marginBottom: 10,
  },
  paymentSection: {
    marginTop: 20,
  },
  paymentTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  paymentOption: {
    flexDirection: "row",
    marginTop: 20,
  },
  paymentText: {
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: "center",
  },
});

const getThemeBackground = (theme: string) => ({
  backgroundColor:
    theme === "light"
      ? Colors.light.colors.background
      : Colors.dark.colors.background,
});

const getPrimaryColor = (theme: string) =>
  theme === "light" ? Colors.light.colors.primary : Colors.dark.colors.primary;
