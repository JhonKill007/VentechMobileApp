import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";
import  CompanyService  from "@/Services/Company/CompanyService";
import { Company } from "@/Models/Company";
import { Branch } from "@/Models/Branch";
const SelectBranchView = () => {

    const [branches, setBranches] = useState<Branch[]>([]);

    
  useEffect(() => {
    CompanyService.getAllBranches(2)
      .then((e: any) => {
        const data = e.data.data;
        console.log(data);
        
        setBranches(data);
        // setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);
  const navigation = useNavigation();

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
