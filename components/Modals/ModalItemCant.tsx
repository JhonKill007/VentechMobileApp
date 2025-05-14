import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  useColorScheme,
  TouchableWithoutFeedback,
  Modal,
  Text,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";

interface ModalItemCant {
  isModalVisible: boolean;
  setModalVisible: Function;
  tittle: string;
  itemToEdit: any;
  save: Function;
  saveText: string;
}

const ModalItemCant = ({
  isModalVisible,
  setModalVisible,
  tittle,
  itemToEdit,
  save,
  saveText,
}: ModalItemCant) => {
  //   console.log(itemToEdit);

  const theme = useColorScheme();
  const [value, setValue] = useState<string>(itemToEdit);
  //   const [users, setUsers] = useState<UserModel[]>();
  //   const [isMentioning, setIsMentioning] = useState<boolean>(false);
  const MAX_CHARACTERS = 200;

  const handleReactionChange = (text: string) => {
    setValue(text);

    // const mentionMatch = text.match(/@(\w+)$/);
    // if (mentionMatch) {
    //   setIsMentioning(true);
    //   Search(mentionMatch[1], 1);
    // } else {
    //   setIsMentioning(false);
    // }
  };

  const handleReactionSubmit = () => {
    save(value.trim());
    setModalVisible(false);
  };

  const toggleModal = () => {
    // setValue(itemToEdit);
    setModalVisible(!isModalVisible);
  };

  //   const Search = (e: string, section: number) => {
  //     if (e !== undefined && e !== "") {
  //       User.SearchUser(e, section)
  //         .then((res: any) => {
  //           setUsers(res.data);
  //         })
  //         .catch((res: any) => {
  //           console.log(res);
  //         });
  //     }
  //   };

  //   const handleUserSelect = (username: string) => {
  //     const updatedValue = value.replace(/@\w*$/, `@${username} `);
  //     setValue(updatedValue);
  //     setIsMentioning(false);
  //   };

  return (
    <Modal visible={isModalVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalBackdrop}>
          <View
            style={{
              backgroundColor:
                theme === "light"
                  ? Colors.light.colors.background
                  : Colors.dark.colors.background,
              borderRadius: 20,
              padding: 20,
              width: "90%",
            }}
          >
            <Text
              style={{
                color:
                  theme === "light"
                    ? Colors.light.colors.text
                    : Colors.dark.colors.text,
              }}
            >
              {tittle}
            </Text>
            <TextInput
              style={{
                height: 40,
                color:
                  theme === "light"
                    ? Colors.light.colors.text
                    : Colors.dark.colors.text,
                borderRadius: 15,
                fontSize: 16,
                // borderWidth: 1,
                // borderColor:
                //   theme === "light"
                //     ? Colors.light.colors.primary
                //     : Colors.dark.colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 10,
              }}
              placeholder="0.0"
              value={value}
              onChangeText={handleReactionChange}
              placeholderTextColor="#ccc"
              keyboardType="decimal-pad"
              maxLength={MAX_CHARACTERS}
              autoFocus
            />

            <Button
              mode="contained"
              textColor="white"
              onPress={() => handleReactionSubmit()}
              style={{ backgroundColor: "#3F75EA", marginTop:15 }}
            >
              Agregar
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "white",
    // width: 400,
    // height: 400,
  },
  button: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  //   modal: {
  //     justifyContent: "flex-end",
  //     margin: 0,
  //   },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  bar: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 2,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  containerOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: "#f0f0f0",
    // backgroundColor: "black",
    borderRadius: 20,
    marginVertical: 8,
    height: 60,
  },
  textOption: {
    margin: "auto",
    fontWeight: "bold",
  },

  //   containerBox: {
  //     width: "100%",
  //     alignItems: "center",
  //     alignSelf: "center",
  //     borderWidth: 1,
  //     borderColor: "#ccc",
  //     borderRadius: 30,
  //     marginBottom: 10,
  //   },
  userProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  publishButton: {
    paddingHorizontal: 10,
  },
  publishButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default ModalItemCant;
