import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@react-navigation/stack";
import { useContext } from "react";
import { Icon } from "react-native-paper";

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useUserContext } from "@/context/UserContext/UserContext";
export const SettingView = () => {
  const theme = useColorScheme();
  const navigation = useNavigation();
  const { userData, updateUser } = useUserContext();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: theme === "light" ? "#fff" : "#1c1c1e" }]}
        onPress={() => navigation.navigate("ChangeMyinfoView" as never)}
      >
        <Icon source="account" size={22} color="#1b1fb2" />
        <Text style={[styles.optionText, { color: theme === "light" ? Colors.light.colors.text : Colors.dark.colors.text }]}>
          Mi Información
        </Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: theme === "light" ? "#fff" : "#1c1c1e" }]}
        onPress={() => navigation.navigate("changePassword" as never)}
      >
        <Icon source="onepassword" size={22} color="#1b1fb2" />
        <Text style={[styles.optionText, { color: theme === "light" ? Colors.light.colors.text : Colors.dark.colors.text }]}>
          Cambiar Contraseña
        </Text>
      </TouchableOpacity>
  
      {userData?.roleName === "Admin" && (
        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme === "light" ? "#fff" : "#1c1c1e" }]}
          onPress={() => navigation.navigate("ChangeMyCompanyView" as never)}
        >
          <Icon source="office-building" size={22} color="#1b1fb2" />
          <Text style={[styles.optionText, { color: theme === "light" ? Colors.light.colors.text : Colors.dark.colors.text }]}>
            Mi Empresa
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 17,
    marginLeft: 15,
    fontWeight: "500",
  },
});

