import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ChargingApp = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* <Image
          source={require("../../../assets/images/adaptive-icon.png")}
          style={styles.image}
        /> */}
        <ActivityIndicator animating={true} color={Colors.light.colors.details} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: 200,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  image: {
    height: 50,
    width: 50,
  },
});

export default ChargingApp;
