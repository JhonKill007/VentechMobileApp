import { Colors } from "@/constants/Colors";
import { Order } from "@/Models/Order";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, FlatList, useColorScheme,StyleSheet } from "react-native";
import { Avatar, Badge, List } from "react-native-paper";
import { Icon, MD3Colors } from "react-native-paper";

export const DetailsOrderView = () => {
  const theme = useColorScheme();
  const route = useRoute();
  const { order }: { order: Order } = route.params;

  const commonTextStyle = {
    color: theme === 'light' ? Colors.light.colors.primary : Colors.dark.colors.primary,
  };
  return (
    <View style={styles.container}>
      {/* Client Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Cliente:</Text>
          <Text style={[styles.boldText, commonTextStyle]}>
            {order.consumer?.name }
          </Text>
        </View>

        {/* Date Section */}
        <View style={styles.row}>
          <Text style={commonTextStyle}>Fecha:</Text>
          <Text style={styles.dateText}>
            {new Date(order.dateHour!).toLocaleDateString('es-DO')}
          </Text>
        </View>

        {/* Payment Method Section */}
        <View style={styles.row}>
          <Text style={commonTextStyle}>Metodo de pago:</Text>
          <Text style={styles.paymentMethodText}>{order.payMethod}</Text>
        </View>

        {/* Products Count Section */}
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Cantidad de productos:</Text>
          <Text style={styles.productCountText}>{order.products!.length} producto(s)</Text>
        </View>

        {/* Total Section */}
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Total de la orden:</Text>
          <Text style={styles.totalText}>
            RD${' '}
            {order.products!.reduce((total, item) => total + item.productTotal!, 0)
              .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        </View>
      </View>

      {/* Products Section */}
      <Text style={[styles.sectionTitle, commonTextStyle]}>Productos:</Text>
      <FlatList
        data={order.products}
        renderItem={({ item }) => (
          <List.Item
            title={item.productName}
            description={`RD$${item.productPrice}`}
            titleStyle={[styles.productTitle, commonTextStyle]}
            left={(props) => (
              <Avatar.Text
                {...props}
                style={[styles.avatar, { backgroundColor: theme === 'light' ? Colors.light.colors.background : Colors.dark.colors.background }]}
                color={commonTextStyle.color}
                label={item.productName!.charAt(0)}
              />
            )}
            right={() => (
              <View style={styles.productInfo}>
                <Text style={[styles.label, commonTextStyle]}>Cantidad:</Text>
                <Text style={[commonTextStyle, styles.productAmount]}>{item.productAmount}</Text>
              </View>
            )}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  productCountText: {
    fontSize: 14,
    color: '#555',
  },
  totalText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
  },
  avatar: {
    marginRight: 10,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productAmount: {
    fontSize: 14,
    marginLeft: 5,
  },
});
