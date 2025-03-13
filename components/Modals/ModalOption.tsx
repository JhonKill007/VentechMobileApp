import { Colors } from "@/constants/Colors";
import { ModalOptionModel } from "@/Models/ModelsComponents/ModalOptionModel";
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
// import Modal from "react-native-modal";

interface IModalPublicationOption {
  isModalVisible: boolean;
  setModalVisible: Function;
  options: ModalOptionModel[];
}

const ModalOption = ({
  isModalVisible,
  setModalVisible,
  options,
}: IModalPublicationOption) => {
  const theme = useColorScheme();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {/* <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={{ height: 20 }} />
          {options.map((o: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={o.function}
              style={[
                styles.containerOption,
                {
                  backgroundColor:
                    theme === "light"
                      ? Colors.light.background
                      : Colors.dark.background,
                },
              ]}
            >
              <Text style={[styles.textOption, { color: o.color }]}>
                {o.name}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    // backgroundColor: "white",
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
});

export default ModalOption;
