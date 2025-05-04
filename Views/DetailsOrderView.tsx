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
      {/* Sección Detalles de Orden */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Cliente:</Text>
          <Text style={[styles.value, commonTextStyle]}>{order.consumer?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>NCF:</Text>
          <Text style={[styles.value, commonTextStyle]}>{order.ncf}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Fecha:</Text>
          <Text style={[styles.label, commonTextStyle]}>
            {new Date(order.dateHour!).toLocaleDateString('es-DO')}
          </Text>
        </View>
  
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Método de pago:</Text>
          <Text style={styles.paymentMethodText}>{order.payMethod}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={[styles.label, commonTextStyle]}>Cantidad de productos:</Text>
          <Text style={[styles.label, commonTextStyle]}>{order.products!.length} producto(s)</Text>
        </View>
  
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.label, commonTextStyle]}>Total:</Text>
          <Text style={styles.totalText}>
            RD
            {order.products!
              .reduce((total, item) => total + item.productTotal!, 0)
              .toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
          </Text>
        </View>
      </View>
  
      {/* Sección de Productos */}
      <Text style={[styles.sectionTitle, commonTextStyle]}>Productos</Text>
      <FlatList
        data={order.products}
        renderItem={({ item }) => (
          <List.Item
            style={styles.productItem}
            title={item.productName}
            description={`RD${(item.productPrice!).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`}
            titleStyle={[styles.productTitle, commonTextStyle]}
            descriptionStyle={commonTextStyle}
           
            right={() => (
              <View style={styles.productInfo}>
                <Text style={[styles.label, commonTextStyle]}>Cant:</Text>
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
    flex: 1,
    padding: 20,
    
  },
  section: {
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  productCountText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  totalRow: {
   
  },
  totalText: {
    fontSize: 16,
    color: '#1b1fb2',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  productItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  avatar: {
    marginRight: 10,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: "#27ae60",
    height: 30,
    padding: 5,
  },
  productAmount: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '600',
    
  },
});

