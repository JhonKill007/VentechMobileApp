import React from "react";
import { useContext } from "react";
import { AuthenticateContext } from "../context/AuthenticateContext/AuthenticateContext";
import { StatusBar } from "expo-status-bar";
import { OutsideRoute } from "./OutsideRoute";
import { useUserContext } from "../context/UserContext/UserContext";
import { useColorScheme } from "react-native";
import { InsideRoute } from "./InsideRoute";

export default function MainRoute() {
  const theme = useColorScheme();
  const { token } = useUserContext();
  const { Authenticate } = useContext(AuthenticateContext) || {};

  return (
    <>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      {Authenticate ? <InsideRoute /> : <OutsideRoute />}
    </>
  );
}
