import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
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
  Icon,
} from "react-native-paper";
import { PermissionsAndroid, Platform } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";

const OrdenesView = () => {
  const [value, setValue] = useState(null);
  const [text, setText] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  // Función para generar el PDF
  const generatePDF = async () => {
    console.log("Entra a generar PDF");

    // Verificar si los permisos ya están concedidos
    if (Platform.OS === "android") {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (!hasPermission) {
        console.log("No tiene el permiso WRITE_EXTERNAL_STORAGE");
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permiso denegado",
            "No se puede generar el PDF sin permisos."
          );
          console.log("Permiso WRITE_EXTERNAL_STORAGE denegado");
          return;
        }
        console.log("Permiso WRITE_EXTERNAL_STORAGE concedido");
      } else {
        console.log("Ya tiene el permiso WRITE_EXTERNAL_STORAGE");
      }
    }

    // Verificar permisos de lectura para Android 11 o superior
    if (Platform.OS === "android" && Platform.Version >= 30) {
      const hasMediaPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!hasMediaPermission) {
        console.log("No tiene el permiso READ_EXTERNAL_STORAGE");
        const grantedMedia = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );

        if (grantedMedia !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permiso denegado",
            "No se puede generar el PDF sin permisos."
          );
          console.log("Permiso READ_EXTERNAL_STORAGE denegado");
          return;
        }
        console.log("Permiso READ_EXTERNAL_STORAGE concedido");
      } else {
        console.log("Ya tiene el permiso READ_EXTERNAL_STORAGE");
      }
    }

    console.log("Permisos concedidos, generando PDF");

    // Crear el contenido HTML para el PDF
    const htmlContent = `
        <h1>Resumen de Compra</h1>
        <p><strong>Cliente:</strong> ${value || "No seleccionado"}</p>
        <p><strong>RNC o Cédula:</strong> ${text}</p>
        <p><strong>Comprobante Fiscal:</strong> ${isSwitchOn ? "Sí" : "No"}</p>
        <h2>Productos</h2>
        <ul>
          ${itemsList
            .map(
              (item) =>
                `<li><strong>${item.title}:</strong> ${item.description}</li>`
            )
            .join("")}
        </ul>
      `;

    // Opciones para la generación del PDF
    const options = {
      html: htmlContent,
      fileName: "resumen_compra",
      directory: "Documents",
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert("PDF generado", `Guardado en: ${file.filePath}`);
      console.log("PDF generado en:", file.filePath);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF");
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
                    <TouchableOpacity
                      style={styles.button}
                      onPress={generatePDF}
                    >
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
