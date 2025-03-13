import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useNavigation } from "expo-router";
import { Sidebar } from "./Sidebar";
import ProcessOrderView from "@/Views/ProcessOrderView";
import SelectBranchView from "@/Views/SelectBranchView";

const Stack = createStackNavigator();

export const InsideRoute = () => {
  return (
    <Stack.Navigator initialRouteName="SelectBranchView">
      <Stack.Screen
        name="SelectBranchView"
        component={SelectBranchView}
        options={{
          headerTitle: "Sucursales",
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
        name="initalApp"
        component={Sidebar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
