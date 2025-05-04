import { useUserContext } from "@/context/UserContext/UserContext";
import { ChangePassword } from "@/Models/ChangePassword";
import { User } from "@/Models/User";
import UserService from "@/Services/User/UserService";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import Toast from "react-native-toast-message";

const ChangeMyinfoView = () => {
  const navigation = useNavigation();
  const { userData, updateUser } = useUserContext();

  const [error, setError] = useState<string>("");
  const [errorIsActive, setErrorIsActive] = useState<boolean>(false);
  const [validatePass, setValidatePass] = useState<boolean>(false);
  const [myUser, setMyUser] = useState<User>({});


  const [fullName, setFullName] = useState<string >(
    userData?.fullName!
  );
  const [email, setEmail] = useState<string >(userData?.email!);
  const [cellphone, setCellphone] = useState<
    string | undefined
  >("");
  useEffect(() => {
    console.log('entro');
    UserService.getMyInfo(userData?.id!)
    .then((e: any) => {
      const data = e.data.data;
      
      setMyUser(data);
      setFullName(data.fullName );
      setEmail(data.email );
      setCellphone(data.cellphone)

    })
    .catch((err: any) => {
      console.error(err);
    });
    
  }, []);


  const handleSave = () => {

    myUser.fullName= fullName;
    myUser.cellphone= cellphone;
    myUser.email= email;

    UserService.UpdateUser(userData?.id!,myUser)
        .then((e: any) => {
          console.log(e);
          
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
  };
  return (
    <>
      <View style={styles.container}>
        <Toast />
        <View style={styles.form}>
          <Text>Nombre Completo</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder=" Nombre Completo"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setFullName(text);
              }}
              value={fullName}
            />
           
          </View>
          <Text>Correo electronico</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electronico"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={email}
            />
           
          </View>
          <Text>Número de telefono </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Número de telefono"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setCellphone(text);
              }}
              value={cellphone}
            />
           
          </View>
          {errorIsActive && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.saveButton}  onPress={handleSave}>
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
    color: "black",
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
  text: {
    fontSize: 17,
    paddingTop: 5,
    paddingLeft: 10,
  },
});

export default ChangeMyinfoView;
