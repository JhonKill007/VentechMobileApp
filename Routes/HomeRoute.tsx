import BoardView from "@/Views/BoardView";
import { HomeView } from "@/Views/HomeView";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

const Stack = createStackNavigator();

export const HomeRoute = () => {
  return (
    <Stack.Navigator initialRouteName="HomeView">
        <Stack.Screen
          name="HomeView"
          component={HomeView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Board"
          component={BoardView}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

