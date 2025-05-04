import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import { AuthenticateContext } from "@/context/AuthenticateContext/AuthenticateContext";
import { useUserContext } from "@/context/UserContext/UserContext";
import User from "@/Services/User/UserService";
import ChargingApp from "@/components/CharginApp";
import { Icon } from "react-native-paper";

const LoginView = () => {
  const navigation = useNavigation();
  const [key, setKey] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const _Authenticated = useContext(AuthenticateContext);
  if (!_Authenticated) return null;
  const { setAuthenticate } = _Authenticated;
  const { updateUser } = useUserContext();

  const handleLogin = () => {
    Keyboard.dismiss();
    setChecking(true);
    if (!key || !password) {
      setError(
        !key
          ? "Coloca tu usuario, email o número"
          : "Debes colocar tu contraseña"
      );
      setChecking(false);
      return;
    }

    User.LogIn({ value: key.toLowerCase(), key: password })
      .then((res) => {
        if (res.data.statusCode === 1) {
          updateUser({
            id: res.data.data.id,
            fullName: res.data.data.fullName,
            username: res.data.data.username,
            email: res.data.data.email,
            roleName: res.data.data.roleName,
            authCode: res.data.data.authCode,
            token: res.data.data.token,
          });
          setAuthenticate(true);
        } else {
          setError("Credenciales incorrectas");
          setChecking(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setError("Error al iniciar sesión");
        setChecking(false);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {checking ? (
          <ChargingApp />
        ) : (
          <>
            {/* <Image
              source={require("../assets/images/adaptive-icon.png")}
              style={{ width: 300, height: 100 }}
            /> */}

            <Text style={{color:'#1b1fb2', fontSize:70, textAlign:"center", marginBottom:20}}>Hatero</Text>
            {error && (
              <Text
                style={{ color: "red", fontStyle: "italic", marginVertical: 8 }}
              >
                {error}
              </Text>
            )}
            <View style={{ width: "80%" }}>
              <TextInput
                style={{
                  height: 40,
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  color: "gray",
                }}
                placeholder="Teléfono, usuario o correo electrónico"
                placeholderTextColor="gray"
                onChangeText={setKey}
                value={key}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    height: 40,
                    paddingHorizontal: 10,
                    color: "gray",
                  }}
                  placeholder="Contraseña"
                  placeholderTextColor="gray"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 10 }}
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
                style={{
                  backgroundColor: "#1b1fb2",
                  borderRadius: 10,
                  paddingVertical: 15,
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={handleLogin}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginView;
