import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  useColorScheme,
  Dimensions,
} from "react-native";
import CompanyService from "@/Services/Company/CompanyService";
import { Branch } from "@/Models/Branch";
import { useUserContext } from "@/context/UserContext/UserContext";
import { Company } from "@/Models/Company";
import { Colors } from "@/constants/Colors";

const SelectBranchView = () => {
  const ScreenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const theme = useColorScheme();
  const { updateBranch, userData, updateCompany } = useUserContext();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [company, setCompany] = useState<Company>({});

  useEffect(() => {
    CompanyService.get(userData?.id!)
      .then((e: any) => {
        setCompany(e.data.data[0]);
        updateCompany(e.data.data[0]);
      })
      .catch((err: any) => {
        console.error(err);
      });
    CompanyService.getAllBranches(userData?.id!)
      .then((e: any) => {
        setBranches(e.data.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [userData]);

  return (
    <View
      style={{
        height: ScreenHeight-110,
        backgroundColor:
          theme === "light"
            ? Colors.light.colors.background
            : Colors.dark.colors.background,
      }}
    >
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
              updateBranch(item);
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
    </View>
  );
};

export default SelectBranchView;
