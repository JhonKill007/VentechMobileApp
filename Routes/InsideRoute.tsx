import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useNavigation } from "expo-router";
import { Sidebar } from "./Sidebar";
import ProcessOrderView from "@/Views/ProcessOrderView";
import SelectBranchView from "@/Views/SelectBranchView";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { DetailsOrderView } from "@/Views/DetailsOrderView";
import { InfoOrderView } from "@/Views/InfoOrderView";

const Stack = createStackNavigator();

export const InsideRoute = () => {

  const theme = useColorScheme();
  const headerTitleColor =
    theme === "light"
      ? Colors.light.colors.details
      : Colors.dark.colors.details;
      
  return (
    <Stack.Navigator initialRouteName="SelectBranchView">
      <Stack.Screen
        name="SelectBranchView"
        component={SelectBranchView}
        options={{
          headerTitle: "Sucursales",
          headerTitleStyle: { color: headerTitleColor, fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="InfoOrderView"
        component={InfoOrderView}
        options={{
          headerTitle: "Informacion de Orden",
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="ProcessOrderView"
        component={ProcessOrderView}
        options={{
          headerTitle: "Detalle de Orden",
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="DetailsOrderView"
        component={DetailsOrderView}
        options={{
          headerTitle: "Detalles del pedido",
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="initalApp"
        component={Sidebar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
