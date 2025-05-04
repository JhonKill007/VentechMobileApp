import { useUserContext } from "@/context/UserContext/UserContext";
import { ChangePassword } from "@/Models/ChangePassword";
import UserService from "@/Services/User/UserService";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid
} from "react-native";
import Toast from 'react-native-toast-message';


const ChangePasswordView = () => {
  const navigation = useNavigation();
  const { userData, updateUser } = useUserContext();

  const [error, setError] = useState<string>("");
  const [errorIsActive, setErrorIsActive] = useState<boolean>(false);
  const [validatePass, setValidatePass] = useState<boolean>(false);

  const [actualPassword, setActualPassword] = useState<string | undefined>(
    undefined
  );
  const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
  const [replayNewPassword, setReplayNewPassword] = useState<
    string | undefined
  >(undefined);

  const [showActualPassword, setShowActualPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReplayNewPassword, setShowReplayNewPassword] = useState(false);

  const handleSave = () => {
    if (newPassword === undefined || newPassword === "") {
      setError("Debes completar tu contraseña");
      setErrorIsActive(true);
    } else if (newPassword != replayNewPassword) {
      setError("La contraseña nueva no coincide");
      setErrorIsActive(true);
    } else {
      setErrorIsActive(false);
      changePassword();
    }
  };

  const changePassword = () => {
    if (validatePass) {

       const chanchePassword: ChangePassword = {
            userId: userData?.id,
            newPassword: newPassword,
            oldPassword: actualPassword,
        };

        UserService.ChangePassword(chanchePassword)
        .then((e: any) => {
          if (e.data.success ) {

            ToastAndroid.show('Actualizada con Exito!', ToastAndroid.SHORT);
            
          } else {
            ToastAndroid.show('Error al actualizar!', ToastAndroid.SHORT);
            setErrorIsActive(true);
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  const validarContrasena = () => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!$@%])[0-9a-zA-Z!$@%]+$/;
    if (newPassword) {
      if (newPassword!.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        setErrorIsActive(true);
        setValidatePass(false);
      } else if (!regex.test(newPassword!)) {
        setError(
          "La contraseña debe incluir números, letras y caracteres especiales (!$@%)."
        );
        setErrorIsActive(true);
        setValidatePass(false);
      } else {
        setErrorIsActive(false);
        setValidatePass(true);
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
      <Toast />
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder=" Contraseña actual"
              placeholderTextColor="gray"
              secureTextEntry={!showActualPassword}
              onChangeText={(text) => {
                setActualPassword(text);
              }}
              value={actualPassword}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowActualPassword(!showActualPassword)}
            >
            
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña nueva"
              placeholderTextColor="gray"
              secureTextEntry={!showNewPassword}
              onChangeText={(text) => {
                setNewPassword(text);
              }}
              onBlur={validarContrasena}
              value={newPassword}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
            
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Repitir contraseña"
              placeholderTextColor="gray"
              secureTextEntry={!showReplayNewPassword}
              onChangeText={(text) => {
                setReplayNewPassword(text);
              }}
              value={replayNewPassword}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowReplayNewPassword(!showReplayNewPassword)}
            >
           
            </TouchableOpacity>
          </View>
          {errorIsActive && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  form: {
    width: "90%",
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
  errorText: {
    color: "red",
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChangePasswordView;