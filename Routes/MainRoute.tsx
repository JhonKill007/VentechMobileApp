import React from "react";
import { useContext, useEffect } from "react";
import { AuthenticateContext } from "../context/AuthenticateContext/AuthenticateContext";
// import { HubsProvider } from "../context/HubsContext/HubsContext";
import { StatusBar } from "expo-status-bar";
import { OutsideRoute } from "./OutsideRoute";
import { useUserContext } from "../context/UserContext/UserContext";
import { Platform, useColorScheme, View } from "react-native";
// import * as NavigationBar from "expo-navigation-bar";
import { InsideRoute } from "./InsideRoute";
import ChargingApp from "@/components/CharginApp";
import getUserDataHook from "@/hooks/getUserDataHook";

export default function MainRoute() {
  const theme = useColorScheme();
  const { userID } = useUserContext();
  const getUserData = getUserDataHook();
  const { Authenticate } = useContext(AuthenticateContext) || {};

  useEffect(() => {
    const initializeUser = async () => {
      if (userID !== undefined) {
        await getUserData(userID!);
      }
    };
    initializeUser();
  }, [userID]);

  //   useEffect(() => {
  //     if (Platform.OS === "android") {
  //       NavigationBar.setBackgroundColorAsync(
  //         theme === "light" ? "white" : "black"
  //       );
  //     }
  //   }, []);

  return (
      <>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      {Authenticate ? (
          <InsideRoute />
        ) : (
            <>
          {userID ? (
              <View
              // <HubsService>
              // </HubsService>
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChargingApp />
            </View>
          ) : (
            <OutsideRoute />
          )}
        </>
      )}
    </>
  );
}

// const HubsService = ({ children }: { children: React.ReactNode }) => {
//   return <HubsProvider>{children}</HubsProvider>;
// };
