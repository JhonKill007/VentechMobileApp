import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { useNavigation } from "expo-router";

import {
  Avatar,
  Button,
  List,
  Surface,
  Provider,
  Searchbar,
} from "react-native-paper";

const HomeView = () => {
  const [visible, setVisible] = useState(false);
  const [search, setsearch] = useState<string>("");
  const navigation = useNavigation();

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
      <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
        <Searchbar
          onChangeText={setsearch}
          value={search}
          style={{
            borderColor: "#3F75EA",
            borderWidth: 1,
            backgroundColor: "white",
            marginBottom: 10,
          }}
        />
        <Surface
          style={{
            padding: 10,
            borderRadius: 10,
            elevation: 4,
            backgroundColor: "#fff",
          }}
        >
          <FlatList
            data={itemsList}
            style={{ maxHeight: 450, marginBottom: 10 }}
            renderItem={({ item, index }) => (
              <List.Item
                key={`${item.id}-${index}`}
                title={item.title}
                description={item.description}
                left={(props) => (
                  <Avatar.Image {...props} source={{ uri: item.image }} />
                )}
                right={() => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#3F75EA",
                        padding: 8,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>1</Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#3F75EA",
                        padding: 8,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
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
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}>
                Descuento
              </Text>
              <Text style={{ fontSize: 16, color: "#333" }}>RD$ 140.00</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}>
                Itebis
              </Text>
              <Text style={{ fontSize: 16, color: "#333" }}>RD$ 140.00</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}>
                Total
              </Text>
              <Text style={{ fontSize: 16, color: "#333" }}>RD$ 140.00</Text>
            </View>
          </View>
        </Surface>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Button
            icon="trash-can-outline"
            mode="contained"
            onPress={() => console.log("Cancelado")}
            style={{ backgroundColor: "red" }}
          >
            Limpiar
          </Button>

          <Button
            icon="check"
            mode="contained"
            onPress={() => navigation.navigate("ProcessOrderView" as never)}
            style={{ backgroundColor: "#3F75EA" }}
          >
            Procesar
          </Button>
        </View>
      </View>
    </Provider>
  );
};
const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
});
export default HomeView;
