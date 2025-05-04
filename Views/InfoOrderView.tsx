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
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RadioButton, Switch, TextInput } from "react-native-paper";
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

  const [razonSocial, setRazonSocial] = useState<string>("");

  const [descuento, setDescuento] = useState<number>(0);
  const [cliente, setCliente] = useState<Consumer>({});
  const [rncOrCedula, setRncOrCedula] = useState<string>("");
  const [hasRnc, setHasRnc] = useState<boolean>(false);

  const [payMetho, setPayMetho] = useState<string>("Efectivo");

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

  const setMetodoPago=(valor:string)=>{
    setPayMetho(valor)

    if(valor=="Crédito"){

    }
  }
  const viewOrdenDetails = () => {
    const infoOrden: InfoOrder = {
      clientId: cliente.id,
      clientName: cliente.name,
      rnc: rncOrCedula,
      razonSocial,
      descuento,
      metodoPago: payMetho,
      credito:cliente.credito
    };

    navigation.navigate(
      "ProcessOrderView" as never,
      {
        selectedProducts: selectedProducts,
        infoOrder: infoOrden,
      } as never
    );
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
            <Dropdown
              style={[styles.dropdown, getThemeBackground(theme)]}
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
                  color={getPrimaryColor(theme)}
                  name="user"
                  size={20}
                />
              )}
            />
  
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
                <Text style={[styles.razonSocial, { color: getPrimaryColor(theme) }]}>
                  {razonSocial}
                </Text>
                {rncOrCedula.length >= 9 && (
                  <TouchableOpacity
                    onPress={() => {
                      setRncOrCedula("");
                      setRazonSocial("");
                    }}
                  >
                    <Icon source="close" color={getPrimaryColor(theme)} size={30} />
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
              <Text style={[styles.paymentTitle, { color: getPrimaryColor(theme) }]}>
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
                  <Text style={[styles.paymentText, { color: getPrimaryColor(theme) }]}>
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
    fontSize:20
  },
  rncContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  input: {
    paddingHorizontal: 10,
    marginBottom: 5,
    flex: 1,
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
  theme === "light"
    ? Colors.light.colors.primary
    : Colors.dark.colors.primary;

