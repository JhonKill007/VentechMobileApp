import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@react-navigation/stack";
import { useContext } from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    useColorScheme,
  } from "react-native";
export const SettingView = () => {
    const theme = useColorScheme();
    const navigation = useNavigation();
  

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
            Cambiar contraseña
          </Text>
        
        </TouchableOpacity>
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
            Mi Empresa
          </Text>
          
        </TouchableOpacity>
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
            Administrar Usuarios
          </Text>
          
        </TouchableOpacity>
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