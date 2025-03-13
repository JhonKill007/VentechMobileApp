import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";

const SelectBranchView = () => {
  const navigation = useNavigation();
  const sucursales = [
    { id: 1, nombre: "Sucursal 1" },
    { id: 2, nombre: "Sucursal 2" },
    { id: 3, nombre: "Sucursal 3" },
    { id: 4, nombre: "Sucursal 4" },
    { id: 5, nombre: "Sucursal 5" },
    { id: 6, nombre: "Sucursal 6" },
  ];
  return (
    <FlatList
      data={sucursales}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          key={index}
          style={{
            width: "90%",
            height: 70,
            margin: "auto",
            marginTop: 10,
            borderRadius: 20,
            backgroundColor: "#E3EFFD",
          }}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "initalApp" as never }],
            })
          }
        >
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {item.nombre}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default SelectBranchView;
