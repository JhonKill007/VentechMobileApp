import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
  useColorScheme,
  StyleSheet,
} from "react-native";
import {
  Provider,
  Icon,
  Portal,
  Modal,
  List,
  Avatar,
  Button,
  Badge,
} from "react-native-paper";
import OrderService from "@/Services/Order/OrderService";

import { Order } from "@/Models/Order";
import { useUserContext } from "@/context/UserContext/UserContext";
import Calendar from "@/components/Modals/Calendar";
import { Colors } from "@/constants/Colors";
import { usePrintHook } from "@/hooks/usePrintHook";
import { ItemOrden } from "@/components/ItemOrden";
import { OrderProduct } from "@/Models/OrderProduct";
import { useFocusEffect } from "@react-navigation/native";

const OrdenesView = () => {
  const theme = useColorScheme();
  const { branch} = useUserContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [selectedToDate, setSelectedToDate] = useState<Date | null>(new Date());
  const [calendarFromVisible, setCalendarFromVisible] =
    useState<boolean>(false);
  const [calendarToVisible, setCalendarToVisible] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const ScreenHeight = Dimensions.get("window").height;
  const ScreenWidth = Dimensions.get("window").width;



  const searchOrden = () => {
    
    OrderService.getAll(
      branch?.id!,
      selectedFromDate!
        ? selectedFromDate.toLocaleDateString("es-DO")
        : new Date().toLocaleDateString("es-DO"),
      selectedToDate
        ? selectedToDate.toLocaleDateString("es-DO")
        : new Date().toLocaleDateString("es-DO")
    )
      .then((e: any) => {
        setOrders(e.data.data);
        setChecking(false);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      // Esta función se ejecutará cada vez que la pantalla sea enfocada (cuando se vuelve de otra vista)
      searchOrden();
      
      // Si necesitas limpiar algo cuando la vista pierde el foco puedes hacerlo aquí
      return () => {
        // Limpiar si es necesario
      };
    }, []) // Dependencias vacías para que se ejecute cada vez que la pantalla tenga el foco
  );

  return (
    <Provider>
      <View
        style={{
          height: ScreenHeight - 110,
          backgroundColor:
            theme === "light"
              ? Colors.light.colors.background
              : Colors.dark.colors.background,
        }}
      >
        <View>
          <View
            style={{
              width: ScreenWidth,
              height: 50,
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "auto",
            }}
          >
            <TouchableOpacity
              onPress={() => setCalendarFromVisible(true)}
              style={{
                padding: 10,
                flex: 1,
                width: ScreenWidth / 2 - 50,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                borderColor: "#3F75EA",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                Desde:
              </Text>
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {selectedFromDate?.toLocaleDateString("es-DO")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCalendarToVisible(true)}
              style={{
                padding: 10,
                flex: 1,
                width: ScreenWidth / 2 - 50,
                borderColor: "#3F75EA",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                Hasta:
              </Text>
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                }}
              >
                {selectedToDate?.toLocaleDateString("es-DO")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                width: 70,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                borderColor: "#3F75EA",
                borderWidth: 1,
              }}
              onPress={() => {
                searchOrden();
              }}
            >
              <Text
                style={{
                  color:
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary,
                  marginTop: 5,
                }}
              >
                Filtrar
              </Text>
            </TouchableOpacity>
          </View>
          <Calendar
            value={selectedFromDate}
            onChange={(date) => setSelectedFromDate(date)}
            calendarvisible={calendarFromVisible}
            onClose={() => setCalendarFromVisible(false)}
          />
          <Calendar
            value={selectedToDate}
            onChange={(date) => setSelectedToDate(date)}
            calendarvisible={calendarToVisible}
            onClose={() => setCalendarToVisible(false)}
          />
        </View>

        <FlatList
          style={{ marginTop: 20 }}
          data={orders}
          keyExtractor={(item) => item.id?.toString()!}
          renderItem={({ item }) => (
            <ItemOrden orden={item} />
          )}
        />

      </View>
    </Provider>
  );
};

export default OrdenesView;
