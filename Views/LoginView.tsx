import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { AuthenticateContext } from "@/context/AuthenticateContext/AuthenticateContext";
import { useUserContext } from "@/context/UserContext/UserContext";
import { UserAuthModel } from "@/Models/UserAuthModel";
import User from "@/Services/User/UserService";
import { AuthLogin } from "@/Models/AuthLogin";
import ChargingApp from "@/components/CharginApp";
import { Icon } from "react-native-paper";

const LoginView = () => {
  const navigation = useNavigation();
  const [key, setKey] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState<boolean>(false);

  const theme = useColorScheme();

  const _Authenticated = useContext(AuthenticateContext);
  if (!_Authenticated) {
    return null;
  }
  const { setAuthenticate } = _Authenticated;

  const { updateUser } = useUserContext();

  const handleLogin = () => {
    handlePressOutside();
    setChecking(true);
    let data: UserAuthModel = {
      value: key.toLowerCase(),
      key: password,
    };

    if (data.value !== "" && data.key !== "") {
      User.LogIn(data)
        .then((res: any) => {
          if (res.data.statusCode == 1) {
            // console.log("Data en el log", res.data);

            const user_result: AuthLogin = {
              id: res.data.data.id,
              fullName: res.data.data.fullName,
              username: res.data.data.username,
              email: res.data.data.email,
              roleName: res.data.data.email,
              authCode: res.data.data.authCode,
              token: res.data.data.token,
            };

            // console.log("Data despues del log:", user_result);
            
            updateUser(user_result);
            setAuthenticate(true);
          } else {
            setError("Credenciales incorrecta");
            setChecking(false);
          }
        })
        .catch((e: any) => {
          console.log(e);
          setError(e);
          setChecking(false);
        });
    } else {
      if (data.key === "") {
        setError("Debes colocar tu contraseña");
        setChecking(false);
      }

      if (data.value === "") {
        setError("Colocar tu usuario, email o numero");
        setChecking(false);
      }
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        {checking ? (
          <ChargingApp />
        ) : (
          <>
            <Image
              source={require("../assets/images/ventech.png")}
              style={styles.branding}
            />
            <View style={styles.errorContainer}>
              <Text style={{ color: "black", fontStyle: "italic" }}>
                {error}
              </Text>
            </View>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Teléfono, usuario o correo electrónico"
                  placeholderTextColor="gray"
                  onChangeText={(text) => setKey(text)}
                  value={key}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="gray"
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    source={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                disabled={checking}
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Iniciar Sesion</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.forgotPassword}>
                <Text style={{ color: 'black' }}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity> */}
              {/* <View style={styles.registerContainer}>
                <Text style={{ color: 'black' }}>
                  ¿Aún no tienes cuenta?{" "}
                  <TouchableOpacity
                    style={{ alignItems: "center", marginTop: -3 }}
                    onPress={() => {
                      navigation.navigate("Register" as never);
                    }}
                  >
                    <Text style={{ color: 'black' }}>Regístrate</Text>
                  </TouchableOpacity>
                </Text>
              </View> */}
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"white"
  },
  branding: {
    width: 300,
    height: 100,
  },
  logo: {
    width: 150,
    height: 35,
    marginTop: -10,
  },
  form: {
    width: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  input: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    color: "gray",
  },
  iconContainer: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 10,
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  errorContainer: {
    height: 25,
    marginBottom: 8,
    marginTop: 20,
  },
});

export default LoginView;
