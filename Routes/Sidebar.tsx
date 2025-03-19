import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image, StyleSheet } from "react-native";
import OrdenesView from "@/Views/OrdenesView";
import PosView from "@/Views/HomeView";
import ProcessOrderView from "@/Views/ProcessOrderView";
import HomeView from "@/Views/HomeView";
import { useUserContext } from "@/context/UserContext/UserContext";

export const Sidebar = ({ children }: any) => {
  const Drawer = createDrawerNavigator();
  const { removeUser } = useUserContext();

  return (
    <Drawer.Navigator
      initialRouteName="Venta"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={screenOptions}
    >
      <Drawer.Screen name="Venta" component={HomeView} />

      <Drawer.Screen name="Ordenes" component={OrdenesView} />
      {/* <Drawer.Screen name="Inventario" component={ProcessOrderView} /> */}
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

const CustomDrawerContent = (props: any) => {
  const { userData } = useUserContext();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>{userData?.fullName}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const screenOptions = {
  headerTitle: () => (
    <View style={styles.brandinglogobox}>
      <Text style={{ fontSize: 30, fontWeight: "bold", color: "#3F75EA" }}>
        Ventech
      </Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  brandinglogobox: {
    flexDirection: "row",
  },
  branding: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  logo: {
    width: 170,
    height: 50,
    resizeMode: "contain",
    marginLeft: -30,
  },
  AddButton: {
    width: 160,
    height: 50,
    borderWidth: 1,
    borderColor: "grey",
    alignSelf: "flex-start",
    marginStart: 20,
    marginTop: 20,
    borderRadius: 30,
    flexDirection: "row",
  },
  ButtonCircleIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 4,
    marginStart: 5,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#54aeff",
  },
});
