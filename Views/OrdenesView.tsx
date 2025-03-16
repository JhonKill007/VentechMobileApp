import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { Avatar, List, Surface, Provider, Icon } from "react-native-paper";


import * as Print from "expo-print";


const OrdenesView = () => {
  const printHTML = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              h1 { color: #007bff; }
              p { font-size: 18px; }
            </style>
          </head>
          <body>
            <h1>Documento HTML</h1>
            <p>Este es un documento HTML que se puede imprimir o guardar como PDF.</p>
          </body>
        </html>
      `;

      await Print.printAsync({ html: htmlContent });
      
    } catch (error) {
      console.error("Error al imprimir:", error);
      Alert.alert("Error", "No se pudo imprimir el documento");
    }
  };

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
  return (
    <Provider>
      <View style={styles.container}>
        <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 10 }}>
          Ordenes
        </Text>
        <Surface style={styles.surface}>
          <ScrollView style={styles.scrollView}>
            {itemsList.map((item, index) => (
              <List.Item
                key={`${item.id}-${index}`} // Evita duplicados
                title={item.title}
                description={item.description}
                left={(props) => (
                  <Avatar.Image {...props} source={{ uri: item.image }} />
                )}
                right={() => (
                  <View style={styles.counterContainer}>
                    <TouchableOpacity style={styles.button} onPress={printHTML}>
                      <Icon source="printer" size={20} color={"blank"} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ))}
          </ScrollView>
        </Surface>
      </View>
    </Provider>
  );
};
const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 200,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  //
  container: {
    flex: 1,
    padding: 10,
  },
  surface: {
    padding: 10,
    borderRadius: 10,
    elevation: 4,
  },
  scrollView: {
    maxHeight: 600,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});
export default OrdenesView;