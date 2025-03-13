import { useNavigation } from "expo-router";
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
} from "react-native";
import { Icon } from "react-native-paper";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { AuthenticateContext } from "../../context/AuthenticateContext/AuthenticateContext";
// import { ThemeContext } from "../../context/themeContext/ThemeContext";
// import { useUserContext } from "../../context/UserContext/UserContext";
// import { UserLoginModel } from "../../Models/User/UserLoginModel";
// import User from "../../Services/User/UserService";
// import { UserPerfilModel } from "../../Models/User/UserPerfilModel";
// import ChargingApp from "../onLoad/ChargingApp";

const LoginView = () => {
  const navigation = useNavigation();
  const [key, setKey] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState<boolean>(false);


//   const _Authenticated = useContext(AuthenticateContext);
//   if (!_Authenticated) {
//     return null;
//   }
//   const { setAuthenticate } = _Authenticated;

//   const { updateUser } = useUserContext();

  const handleLogin = () => {
    // handlePressOutside();
    // setChecking(true);
    // let data: UserLoginModel = {
    //   Key: key,
    //   Password: password,
    // };

    // if (data.Key !== "" && data.Password !== "") {
    //   User.LogIn(data)
    //     .then((res: any) => {
    //       if (res.data.code == 200) {
    //         let user_result: UserPerfilModel = {
    //           user: {
    //             id: res.data.id,
    //             name: res.data.name,
    //             username: res.data.username,
    //             email: res.data.email,
    //             password: undefined,
    //             phone: res.data.phone,
    //             birthday: res.data.birthday,
    //             gender: res.data.gender,
    //             status: res.data.status,
    //             verify: res.data.verify,
    //             perfilData: {
    //               presentation: res.data.perfilData.presentation,
    //               idMediaDataProfile: res.data.perfilData.idMediaDataProfile,
    //               // idMediaDataCover: res.data.perfilData.idMediaDataCover,
    //             },
    //             createDate: new Date(res.data.createDate),
    //           },
    //           isFollow: res.data.isFollow,
    //           profilePhoto: res.data.profilePhoto,
    //           // coverPhoto: res.data.coverPhoto,
    //           seguidos: res.data.seguidos,
    //           seguidores: res.data.seguidores,
    //         };

    //         updateUser(user_result);
    //         setAuthenticate(true);
    //       }
    //       if (res.data.code == 204) {
    //         setChecking(false);
    //         setError(res.data.message);
    //       }
    //     })
    //     .catch((e: any) => {
    //       console.log(e);
    //       setError(e);
    //     });
    // } else {
    //   if (data.Password === "") {
    //     setError("Debes colocar tu contraseña");
    //   }

    //   if (data.Key === "") {
    //     setError("Colocar tu usuario, email o numero");
    //   }
    // }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        {checking ? (
          // <Image
          //   source={require("../../../assets/adaptive-icon.png")}
          //   style={{ margin: "auto", width: 70, height: 70 }}
          // />
        //   <ChargingApp />
        <></>
        ) : (
          <>
            <Image
              source={require("../assets/images/adaptive-icon.png")}
              style={styles.branding}
            />
            <View style={styles.errorContainer}>
              <Text style={{ color: 'black', fontStyle: "italic" }}>
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
  },
  branding: {
    width: 100,
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
    height: 15,
    marginBottom: 8,
  },
});

export default LoginView;
