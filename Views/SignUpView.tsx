
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { ThemeContext } from "../../context/themeContext/ThemeContext";
// import Validate from "../../Services/Validate/ValidateService";
// import DateTimePicker from "react-native-ui-datepicker";
// import RNPickerSelect from "react-native-picker-select";
// import signUpConst from "../../Json/signUpConst.json";
// import { UserCreateModel } from "../../Models/User/UserCreateModel";
// import Data from "../../Services/Data/Data";
// import User from "../../Services/User/UserService";
// import { UserPerfilModel } from "../../Models/User/UserPerfilModel";
// import { AuthenticateContext } from "../../context/AuthenticateContext/AuthenticateContext";
// import { useUserContext } from "../../context/UserContext/UserContext";

const SignUpView = () => {

  const [error, setError] = useState<string>("");
  const [errorIsActive, setErrorIsActive] = useState<boolean>(false);
  const [signsteps, setSignSteps] = useState<number>(0);

  const [name, setName] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [replayPassword, setReplayPassword] = useState<string | undefined>(
    undefined
  );
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [gender, setGender] = useState<string | undefined>(undefined);

  const [showPassword, setShowPassword] = useState(false);
  const [showReplayPassword, setShowReplayPassword] = useState(false);
  const [validateEmail, setValidateEmail] = useState<boolean>(false);
  const [validateUsername, setValidateUsername] = useState<boolean>(false);
  const [validatePass, setValidatePass] = useState<boolean>(false);
  const [validateAge, setValidateAge] = useState<boolean>(true);

//   const _Authenticated = useContext(AuthenticateContext);
//   if (!_Authenticated) {
//     return null;
//   }
//   const { setAuthenticate } = _Authenticated;

//   const { updateUser } = useUserContext();

  const SaveUser = () => {
    // let data: UserCreateModel = {
    //   Id: "",
    //   Name: name,
    //   Username: username,
    //   Phone: "",
    //   Email: email!.toLowerCase(),
    //   Password: password,
    //   Birthday: `${birthday}`,
    //   Gender: gender,
    //   CreateDate: Data._Today,
    // };

    // User.Create(data)
    //   .then((res: any) => {
    //     if (res.data.code == 200) {
    //       let user_result: UserPerfilModel = {
    //         user: {
    //           id: res.data.id,
    //           name: res.data.name,
    //           username: res.data.username,
    //           email: res.data.email,
    //           password: undefined,
    //           phone: res.data.phone,
    //           birthday: res.data.birthday,
    //           gender: res.data.gender,
    //           status: res.data.status,
    //           verify: res.data.verify,
    //           perfilData: {
    //             presentation: res.data.presentation,
    //             idMediaDataProfile: res.data.idMediaDataProfile,
    //             // idMediaDataCover: res.data.idMediaDataCover,
    //           },
    //           createDate: new Date(res.data.createDate),
    //         },
    //         isFollow: res.data.isFollow,
    //         profilePhoto: res.data.profilePhoto,
    //         // coverPhoto: res.data.coverPhoto,
    //         seguidos: res.data.seguidos,
    //         seguidores: res.data.seguidores,
    //       };
    //       updateUser(user_result);
    //       setAuthenticate(true);
    //     }
    //     if (res.data.code == 204) {
    //       setError(res.data.message);
    //     }
    //   })
    //   .catch((e: any) => {
    //     console.log(e);
    //     setError(e);
    //     setErrorIsActive(!errorIsActive);
    //   });
  };

  const ValidateData = () => {
    let edad = getEdad(birthday);
    setValidateAge(edad > 10);
  };

  function getEdad(fecha: Date) {
    let hoy = new Date();
    let fechaNacimiento = fecha;
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }
    return edad;
  }

//   const ValidateEmail = (email: string) => {
//     if (email !== undefined && email !== "") {
//       Validate.validateEmail(email.toLowerCase())
//         .then((res: any) => {
//           if (res.data) {
//             setValidateEmail(true);
//             setErrorIsActive(false);
//           } else {
//             setValidateEmail(false);
//             setError("Email no disponible");
//             setErrorIsActive(true);
//           }
//         })
//         .catch((res: any) => {});
//     } else {
//       setValidateUsername(false);
//     }
//   };

//   const VerifyUsername = (username: string) => {
//     if (username !== undefined && username !== "") {
//       if (ValidateUsername(username)) {
//         Validate.validateUsername(username.toLowerCase())
//           .then((res: any) => {
//             if (res.data) {
//               setValidateUsername(true);
//               setErrorIsActive(false);
//             } else {
//               setValidateUsername(false);
//               setError("Usuario no disponible");
//               setErrorIsActive(true);
//             }
//           })
//           .catch((err: any) => {
//             console.error(err);
//           });
//       }
//     } else {
//       setValidateUsername(false);
//     }
//   };

  const ValidateUsername = (username: string) => {
    if (username.length < 7 || username.length > 30) {
      setValidateUsername(false);
      setError("Usuario, maximo 30 caracteres, minimo 7 caracteres");
      setErrorIsActive(true);
      return false;
    }

    if (/^\d+$/.test(username)) {
      setValidateUsername(false);
      setError("El usuario no puede contener solo números");
      setErrorIsActive(true);
      return false;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      setValidateUsername(false);
      setError("El usuario no puede contener caracteres especiales");
      setErrorIsActive(true);
      return false;
    }

    setValidateUsername(true);
    setErrorIsActive(false);
    return true;
  };

  const validarContrasena = () => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!$@%])[0-9a-zA-Z!$@%]+$/;
    if (password!.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setErrorIsActive(true);
      setValidatePass(false);
    } else if (!regex.test(password!)) {
      setError(
        "La contraseña debe incluir números, letras y caracteres especiales (!$@%)."
      );
      setErrorIsActive(true);
      setValidatePass(false);
    } else {
      setErrorIsActive(false);
      setValidatePass(true);
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const placeholder = {
    label: "Selecciona tu género...",
    value: null,
    color: "#9EA0A4",
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        {/* <Image
          source={require("../assets/images/adaptive-icon.png")}
          style={styles.logo}
        /> */}
        <View style={{ marginBottom: 10, height: 20 }}>
          {errorIsActive && (
            <Text
              style={{ color: "red", alignSelf: "center", fontWeight: "bold" }}
            >
              {error}
            </Text>
          )}
        </View>
        <View style={styles.form}>
          {signsteps === 0 && (
            <>
              <Text style={[styles.title, { color: 'black' }]}>
                Registrate
              </Text>
              <Text style={{ color: 'black' }}>
                Es super facil. Solo tienes que completar un simple formulario y
                podras compartir tus mejores momentos con tus amigos, familiares
                y el mundo.
              </Text>
              <View style={[styles.inputContainer, { marginTop: 10 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor="gray"
                  onChangeText={(text) => setName(text)}
                  value={name}
                />
              </View>
              <Text style={[styles.miniInstruction, { color: 'black' }]}>
                Usa el nombre por el cual te conozcan asi sera mas facil
                encontrarte cuando te busquen. Tu nombre debe tener un tamaño
                maximo de 50 caracteres.
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  if (name === undefined || name === "") {
                    setError("Debes completar tu nombre");
                    setErrorIsActive(true);
                  } else {
                    setSignSteps(signsteps + 1);
                    setErrorIsActive(false);
                  }
                }}
              >
                <Text style={styles.buttonText}>Siguiente</Text>
              </TouchableOpacity>
            </>
          )}

          {signsteps === 1 && (
            <>
              <Text style={{ color: 'black' }}>
                Tu usuario es otra de las formas en que las personas pueden
                buscarte ademas de que es una llave unica de acceso a tu cuenta.
              </Text>
              <View style={[styles.inputContainer, { marginTop: 10 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  placeholderTextColor="gray"
                  onChangeText={(text) => {
                    if (/\s/.test(text.toLowerCase())) {
                      setError("El usuario no puede contener espacios");
                      setErrorIsActive(true);
                    } else {
                      setUsername(text.toLowerCase());
                      if (text.length > 7) {
                        // VerifyUsername(text.toLowerCase());
                      } else {
                        setValidateUsername(false);
                      }
                    }
                  }}
                  maxLength={30}
                  value={username}
                />
                <View style={styles.iconContainer}>
                  <Icon
                    source={"check-circle-outline"}
                    size={20}
                    color={validateUsername ? "green" : "#e75e69"}
                  />
                </View>
              </View>
              <Text style={[styles.miniInstruction, { color: 'black' }]}>
                Tu usuario debe tener un tamaño maximo de 30 caracteres y no se
                aceptan espacios ni caracteres especiales.
              </Text>
              <View style={styles.interactionBotonBox}>
                <TouchableOpacity
                  style={styles.loginButtonBack}
                  onPress={() => {
                    setSignSteps(signsteps - 1);
                  }}
                >
                  <Text style={styles.buttonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButtonNext}
                  onPress={() => {
                    if (username === undefined || username === "") {
                      setError("Debes completar tu usuario");
                      setErrorIsActive(true);
                    } else {
                      setErrorIsActive(false);
                      if (validateUsername) {
                        setSignSteps(signsteps + 1);
                      }
                      if (username.length < 7 || username.length > 30) {
                        setValidateUsername(false);
                        setError(
                          "Usuario, maximo 30 caracteres, minimo 7 caracteres"
                        );
                        setErrorIsActive(true);
                        return false;
                      }
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {signsteps === 2 && (
            <>
              <Text style={{ color: 'black' }}>
                Con tu email tendras de acceso a tu cuenta, y tambien podras
                recuperarla en caso de perdida y olvido de contraceña.
              </Text>
              <View style={[styles.inputContainer, { marginTop: 10 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="gray"
                  onChangeText={(text) => {
                    if (/\s/.test(text)) {
                      setError("El email no puede contener espacios");
                      setErrorIsActive(true);
                    } else {
                      setEmail(text);
                      if (
                        /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(
                          text
                        )
                      ) {
                        // ValidateEmail(text);
                      } else {
                        setValidateEmail(false);
                      }
                    }
                  }}
                  value={email}
                />
                <View style={styles.iconContainer}>
                  <Icon
                    source={"check-circle-outline"}
                    size={20}
                    color={validateEmail ? "green" : "#e75e69"}
                  />
                </View>
              </View>
              <View style={styles.interactionBotonBox}>
                <TouchableOpacity
                  style={styles.loginButtonBack}
                  onPress={() => {
                    setSignSteps(signsteps - 1);
                  }}
                >
                  <Text style={styles.buttonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButtonNext}
                  onPress={() => {
                    if (email === undefined || email === "") {
                      setError("Debes completar tu email");
                      setErrorIsActive(true);
                    } else {
                      if (
                        /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(
                          email
                        )
                      ) {
                        setErrorIsActive(false);
                        if (validateEmail) {
                          setSignSteps(signsteps + 1);
                        }
                      } else {
                        setError("Email no valido");
                        setErrorIsActive(true);
                      }
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {signsteps === 3 && (
            <>
              <Text style={{ color: 'black' }}>
                Por favor, ingresa una contraseña segura para proteger tu
                cuenta. Asegúrate de que sea algo que puedas recordar
                fácilmente.
              </Text>

              <View style={[styles.inputContainer, { marginTop: 10 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="gray"
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  onBlur={validarContrasena}
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="gray"
                  secureTextEntry={!showReplayPassword}
                  onChangeText={(text) => {
                    setReplayPassword(text);
                  }}
                  value={replayPassword}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowReplayPassword(!showReplayPassword)}
                >
                  <Icon
                    source={showReplayPassword ? "eye-off" : "eye"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.miniInstruction, { color: 'black' }]}>
                La contraseña debe tener al menos 6 caracteres e incluir una
                combinación de números, letras y caracteres especiales (!$@%).
              </Text>

              <View style={styles.interactionBotonBox}>
                <TouchableOpacity
                  style={styles.loginButtonBack}
                  onPress={() => {
                    setSignSteps(signsteps - 1);
                  }}
                >
                  <Text style={styles.buttonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButtonNext}
                  onPress={() => {
                    if (password === undefined || password === "") {
                      setError("Debes completar tu contraseña");
                      setErrorIsActive(true);
                    } else if (password != replayPassword) {
                      setError("La contraseña nueva no coincide");
                      setErrorIsActive(true);
                    } else {
                      if (validatePass) {
                        setErrorIsActive(false);
                        setSignSteps(signsteps + 1);
                      }
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {signsteps === 4 && (
            <>
              <Text style={{ color: 'black' }}>
                Selecciona tu género. Puedes elegir entre Masculino, Femenino, o
                Personalizado si prefieres especificar tu identidad de género de
                otra manera.
              </Text>
              <View style={{ marginTop: 20 }}>
                {/* <RNPickerSelect
                  placeholder={placeholder}
                  value={gender}
                  onValueChange={(value: string) => setGender(value)}
                  items={signUpConst.gender}
                  style={pickerSelectStyles}
                  Icon={() => {
                    return (
                      <Icon
                        style={{ marginTop: 3 }}
                        name="chevron-down"
                        size={40}
                        color="grey"
                      />
                    );
                  }}
                /> */}
              </View>
              <View style={styles.interactionBotonBox}>
                <TouchableOpacity
                  style={styles.loginButtonBack}
                  onPress={() => {
                    setSignSteps(signsteps - 1);
                  }}
                >
                  <Text style={styles.buttonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButtonNext}
                  onPress={() => {
                    if (gender === undefined || gender === null) {
                      setError("Debes seleccionar un genero");
                      setErrorIsActive(true);
                    } else {
                      setErrorIsActive(false);
                      setSignSteps(signsteps + 1);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {signsteps === 5 && (
            <>
              <Text style={{ color: 'black' }}>
                Selecciona tu fecha de nacimiento
              </Text>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                {/* <DateTimePicker
                  mode="single"
                  date={birthday}
                  onChange={(params: any) => setBirthday(new Date(params.date))}
                /> */}
              </View>
              <View style={styles.interactionBotonBox}>
                <TouchableOpacity
                  style={styles.loginButtonBack}
                  onPress={() => {
                    setSignSteps(signsteps - 1);
                  }}
                >
                  <Text style={styles.buttonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButtonNext}
                  onPress={() => {
                    setSignSteps(signsteps + 1);
                    ValidateData();
                  }}
                >
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {signsteps === 6 && (
            <>
              <Text style={{ color: 'black' }}>
                Al registrarte estas aceptando todas nuestras las politicas y
                condiciones.
              </Text>
              {!validateAge && (
                <View
                  style={{
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: 'black',
                    padding: 20,
                    marginTop: 10,
                  }}
                >
                  <Text style={[styles.Subtitle, { color: 'black' }]}>
                    Límite de Edad Detectado
                  </Text>
                  <Text style={{ fontSize: 13, color: 'black' }}>
                    Hemos detectado que la edad asociada a esta cuenta está por
                    debajo del límite de edad permitido. La creación de esta
                    cuenta solo está permitida bajo la condición de que sea
                    supervisada por padres o tutores legales. Aycoro no se hace
                    responsable del incumplimiento de esta condición. Al
                    registrarte, estarás aceptando y comprometiéndote a cumplir
                    con esta normativa.
                  </Text>
                </View>
              )}

              <View style={styles.interactionBotonBox}>
                <TouchableOpacity
                  style={styles.loginButtonBack}
                  onPress={() => {
                    setSignSteps(signsteps - 1);
                  }}
                >
                  <Text style={styles.buttonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButtonNext}
                  onPress={() => {
                    SaveUser();
                  }}
                >
                  <Text style={styles.buttonText}>Registrate</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  form: {
    width: "80%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  Subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  miniInstruction: {
    fontSize: 10,
  },
  InputTitle: {
    fontSize: 17,
    fontWeight: "bold",
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
  interactionBotonBox: {
    flexDirection: "row",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    color: "gray",
  },
  loginButtonNext: {
    width: "50%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    color: "gray",
  },
  loginButtonBack: {
    width: "50%",
    backgroundColor: "#415061",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    color: "gray",
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "grey",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "grey",
    paddingRight: 30,
  },
});

export default SignUpView;
