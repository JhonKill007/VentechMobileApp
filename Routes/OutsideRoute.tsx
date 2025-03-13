import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import LoginView from "@/Views/LoginView";
// import { Icon } from 'react-native-paper';
import SignUpView from "@/Views/SignUpView";

const Stack = createStackNavigator();

export const OutsideRoute = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Register"
        component={SignUpView}
        options={{
          headerTitle: "Registrate",
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => navigation.navigate("Login" as never)}
            >
              {/* <Icon source="chevron-left" size={34} color={'black'} /> */}
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
