import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image, useColorScheme } from "react-native";
import OrdenesView from "@/Views/OrdenesView";
import HomeView from "@/Views/HomeView";
import { useUserContext } from "@/context/UserContext/UserContext";
import { Colors } from "@/constants/Colors";
import SelectBranchView from "@/Views/SelectBranchView";
import { SettingView } from "@/Views/SettingView";

export const Sidebar = () => {
  const Drawer = createDrawerNavigator();
  const { removeUser } = useUserContext();
  const theme = useColorScheme();

  const screenOptions = React.useMemo(
    () => ({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            backgroundColor:
              theme === "light"
                ? Colors.light.colors.background
                : Colors.dark.colors.background,
          }}
        >
          {/* <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "#3F75EA",
            }}
          >
            Ventech
          </Text> */}
          {/* <Image
            source={require("../assets/images/title-logo.png")}
            style={{
              width: 150,
              height: 30,
              // borderRadius: 50,
            }}
          /> */}

          <Text
            style={{
              color: "#1b1fb2",
              fontSize: 30,
              textAlign: "center",
              backgroundColor:
              theme === "light"
                ? Colors.light.colors.background
                : '#16161a',
            }}
          >
            Hatero
          </Text>
        </View>
      ),
    }),
    [theme]
  );

  return (
    <Drawer.Navigator
      initialRouteName="Venta"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} theme={theme} />
      )}
      screenOptions={screenOptions}
    >
      <Drawer.Screen name="Venta" component={HomeView} />
      <Drawer.Screen name="Ordenes" component={OrdenesView} />
      <Drawer.Screen
        name="Cambiar de sucursales"
        component={SelectBranchView}
      />
      <Drawer.Screen name="Configuracion" component={SettingView} />
      <Drawer.Screen
        name="Cerrar Sesión"
        component={() => null}
        listeners={({ navigation }) => ({
          focus: () => {
            removeUser();
            navigation.closeDrawer();
          },
        })}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = React.memo(({ theme, ...props }: any) => {
  const { userData } = useUserContext();

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          alignItems: "center",
          padding: 20,
        }}
      >
        <Image
          source={{
            uri: "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: 18,
            fontWeight: "bold",
            color:
              theme === "light"
                ? Colors.light.colors.primary
                : Colors.dark.colors.primary,
          }}
        >
          {userData?.fullName}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
});

export default Sidebar;
