import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Switch, TextInput } from "react-native-paper";

import {
  Avatar,
  Button,
  Title,
  Paragraph,
  List,
  Surface,
  Portal,
  Modal,
  Provider,
  IconButton,
  Searchbar,
} from "react-native-paper";
import { useNavigation } from "expo-router";
import ConsumerService from "@/Services/CommonServices/ConsumerService";
import { Consumer } from "@/Models/Consumer";
import ChargingApp from "@/components/CharginApp";
import { Discount } from "@/Models/Discount";
import DiscountService  from "@/Services/CommonServices/DiscountService";
const ProcessOrderView = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [consumer, setConsumer] = useState<Consumer[]>([]);
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [checking, setChecking] = useState<boolean>(true);

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
        setDiscount(data.filter(x=>x.type==1));
        console.log(discount);
        
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);
 
  const itemsList = [
    {
      id: "1",
      title: "Botellon de agua",
      description: "DOP 40.00",
      image: "https://picsum.photos/id/1/200",
    },
    {
      id: "2",
      title: "Queso Blanco",
      description: "DOP 230.00",
      image: "https://picsum.photos/id/2/200",
    },
    {
      id: "3",
      title: "Queso Amarillo",
      description: "DOP 250.00.",
      image: "https://picsum.photos/id/3/200",
    },
    {
      id: "1",
      title: "Botellon de agua",
      description: "DOP 40.00",
      image: "https://picsum.photos/id/1/200",
    },
    {
      id: "2",
      title: "Queso Blanco",
      description: "DOP 230.00",
      image: "https://picsum.photos/id/2/200",
    },
    {
      id: "3",
      title: "Queso Amarillo",
      description: "DOP 250.00.",
      image: "https://picsum.photos/id/3/200",
    },
    {
      id: "1",
      title: "Botellon de agua",
      description: "DOP 40.00",
      image: "https://picsum.photos/id/1/200",
    },
    {
      id: "2",
      title: "Queso Blanco",
      description: "DOP 230.00",
      image: "https://picsum.photos/id/2/200",
    },
    {
      id: "3",
      title: "Queso Amarillo",
      description: "DOP 250.00.",
      image: "https://picsum.photos/id/3/200",
    },
    {
      id: "1",
      title: "Botellon de agua",
      description: "DOP 40.00",
      image: "https://picsum.photos/id/1/200",
    },
    {
      id: "2",
      title: "Queso Blanco",
      description: "DOP 230.00",
      image: "https://picsum.photos/id/2/200",
    },
    {
      id: "3",
      title: "Queso Amarillo",
      description: "DOP 250.00.",
      image: "https://picsum.photos/id/3/200",
    },
  ];

  const verifyClientInformation= (client:any)=>{
    setHasRnc(client.hasRnc)
    setRncOrCedula(client.rncOCedula)
  }
  
  return (
    <Provider>
      {checking ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ChargingApp />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
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
            />): <View></View> }

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
            <Surface style={styles.surface}>
              <ScrollView style={styles.scrollView}>
                {itemsList.map((item, index) => (
                  <List.Item
                    key={`${item.id}-${index}`}
                    title={item.title}
                    description={item.description}
                    left={(props) => (
                      <Avatar.Image {...props} source={{ uri: item.image }} />
                    )}
                    right={() => (
                      <View style={styles.counterContainer}>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>1</Text>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                ))}
              </ScrollView>
            </Surface>
            {/* Switch de Comprobante Fiscal */}
            <View style={styles.montosContainer}>
              <View style={styles.montos}>
                <Text style={styles.label}>Descuento</Text>
                <Text style={styles.label}>140.00</Text>
              </View>
              <View style={styles.montos}>
                <Text style={styles.label}>Itebis</Text>
                <Text style={styles.label}>140.00</Text>
              </View>
              <View style={styles.montos}>
                <Text style={styles.label}>Total</Text>
                <Text style={styles.label}>140.00</Text>
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
        </ScrollView>
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
    display: "flex",
    backgroundColor: "#fff",
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
