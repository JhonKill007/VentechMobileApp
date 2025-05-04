import { useUserContext } from "@/context/UserContext/UserContext";
import { ChangePassword } from "@/Models/ChangePassword";
import { Company } from "@/Models/Company";
import { User } from "@/Models/User";
import { Colors } from "@/constants/Colors";

import  CompanyService  from "@/Services/Company/CompanyService";
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
  useColorScheme,
} from "react-native";
import Toast from "react-native-toast-message";

const ChangeMyCompanyView = () => {
  const navigation = useNavigation();
  const { userData, updateUser , company} = useUserContext();

  const [errorIsActive, setErrorIsActive] = useState<boolean>(false);
  const [myCompany, setMyCompany] = useState<Company>({});
  const [razonSocial, setRazonSocial] = useState<string >("");
  const [rnc, setRnc] = useState<string >("");
  const [address, setAddress] = useState<string>("");
  const [cellphone, setCellphone] = useState<string >("");

  const theme = useColorScheme();

   const commonTextStyle = {
      color: theme === 'light' ? Colors.light.colors.primary : Colors.dark.colors.primary,
    };

  useEffect(() => {
    CompanyService.getById(company?.id!)
    .then((e: any) => {
      const data = e.data.data;
      
        setMyCompany(data);
        setRazonSocial(data.name);
        setRnc(data.rnc);
        setAddress(data.address)
        setCellphone(data.telefono)

    })
    .catch((err: any) => {
      console.error(err);
    });
    
  }, []);


  const handleSave = () => {

    myCompany.name= razonSocial;
    myCompany.rnc= rnc;
    myCompany.address= address;
    myCompany.telefono= cellphone;

    CompanyService.update(myCompany)
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
  };
  return (
    <>
      <View style={styles.container}>
        <Toast />
        <View style={styles.form}>
          <Text style={commonTextStyle}>Razon Social</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, commonTextStyle]}
              placeholder=" Nombre Completo"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setRazonSocial(text);
              }}
              value={razonSocial}
            />
           
          </View>
          <Text style={commonTextStyle}>RNC</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, commonTextStyle]}
              placeholder="Correo electronico"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setRnc(text);
              }}
              value={rnc}
            />
           
          </View>
          <Text style={commonTextStyle}>Direccion </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, commonTextStyle]}
              placeholder="Número de telefono"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setAddress(text);
              }}
              value={address}
            />
           
          </View>
          <Text style={commonTextStyle}>Número de telefono </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, commonTextStyle]}
              placeholder="Número de telefono"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setCellphone(text);
              }}
              value={cellphone}
            />
           
          </View>
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
    paddingVertical: 10,
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

export default ChangeMyCompanyView;
