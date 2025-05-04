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
        style={styles.touchableOpacity}
        onPress={() => navigation.navigate("ChangeMyinfoView" as never)}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            },
          ]}
        >
          <Icon source={"account"} size={20} color="#1b1fb2" />
          Mi Informacion
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => navigation.navigate("changePassword" as never)}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            },
          ]}
        >
          <Icon source={"onepassword"} size={20} color="#1b1fb2" />
          Cambiar contraseña
        </Text>
      </TouchableOpacity>

      {userData?.roleName == "Admin" && (
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => navigation.navigate("ChangeMyCompanyView" as never)}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            },
          ]}
        >
          <Icon source={"office-building"} size={20} color="#1b1fb2" />
          Mi Empresa
        </Text>
      </TouchableOpacity>
      )}
      {/* <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => navigation.navigate("ChangeMyCompanyView" as never)}
        >
          <Text
            style={[
              styles.text,
              {
                color:
                  theme === "light"
                    ? Colors.light.colors.text
                    : Colors.dark.colors.text,
              },
            ]}
          >
            Administrar Usuarios
          </Text>
          
        </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.touchableOpacity}>
          <Text
            style={[
              styles.text,
              {
                color:
                  theme === "light"
                    ? Colors.light.colors.text
                    : Colors.dark.colors.text,
              },
            ]}
          >
            Agregar cuenta
          </Text>
        </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  touchableOpacity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
  },
  text: {
    fontSize: 17,
    paddingTop: 5,
    paddingLeft: 10,
  },
});
