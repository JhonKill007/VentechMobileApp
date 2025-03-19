import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";
import CompanyService from "@/Services/Company/CompanyService";
import { Branch } from "@/Models/Branch";
import { useUserContext } from "@/context/UserContext/UserContext";

const SelectBranchView = () => {
  const { token } = useUserContext();
  const navigation = useNavigation();
  const { updateBranch, userData } = useUserContext();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    CompanyService.getAllBranches(userData?.id!, token!)
      .then((e: any) => {
        setBranches(e.data.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [userData]);

  return (
    <FlatList
      data={branches}
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
          onPress={() => {
            updateBranch(item.id!);
            navigation.reset({
              index: 0,
              routes: [{ name: "initalApp" as never }],
            });
          }}
        >
          <Text
            style={{
              textAlign: "center",
              margin: "auto",
              fontSize: 16,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default SelectBranchView;
