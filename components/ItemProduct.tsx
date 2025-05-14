import { Colors } from "@/constants/Colors";
import { Product } from "@/Models/Product";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { Avatar, List, Modal, PaperProvider, Portal } from "react-native-paper";
import ModalItemCant from "./Modals/ModalItemCant";

interface IItemProduct {
  product: Product;
  add: Function;
}

export type ItemProductRef = {
  reset: () => void;
};

const ItemProduct = forwardRef<ItemProductRef, IItemProduct>(
  ({ product, add }, ref) => {
    const theme = useColorScheme();
    const [cantidad, setCantidad] = useState<number>(0);

    const [visible, setVisible] = useState<boolean>(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const sumarCant = () => {
      add(product.id, product, cantidad + 1);
      setCantidad(cantidad + 1);
    };

    const restarCant = () => {
      if (cantidad > 0.0001) {

        if(cantidad - 1<0){

        }else{
 add(product.id, product, cantidad - 1);
        setCantidad(cantidad - 1);
        }
       
      }
    };

    const setFromModal=(cantidad:any)=>{
      
       if (cantidad >= 0) {
        add(product.id, product, cantidad );
        setCantidad(cantidad );
      }
    }
    useImperativeHandle(ref, () => ({
      reset() {
        setCantidad(0);
      },
    }));


    return (
      <>
        <TouchableOpacity onPress={showModal}>
          <List.Item
           
            title={product.name!}
            description={`RD$${product.price}`}
            left={(props) =>
              product.photo ? (
                <Avatar.Image
                  {...props}
                  style={{
                    backgroundColor:
                      theme === "light"
                        ? Colors.light.colors.background
                        : Colors.dark.colors.background,
                  }}
                  source={{ uri: "data:image/png;base64," + product.photo }}
                />
              ) : (
                <Avatar.Text
                  {...props}
                  style={{
                    backgroundColor:
                      theme === "light"
                        ? Colors.light.colors.background
                        : Colors.dark.colors.background,
                  }}
                  color={
                    theme === "light"
                      ? Colors.light.colors.primary
                      : Colors.dark.colors.primary
                  }
                  label={product.name!.charAt(0)}
                />
              )
            }
            right={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: -23,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3F75EA",
                    padding: 8,
                    borderRadius: 25,
                    //   marginHorizontal: 5,
                    width: 40,
                    height: 40,
                  }}
                  onPress={restarCant}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      marginTop: 1,
                      textAlign: "center",
                    }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <View style={{ width: 50 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "center",
                      color:
                        theme === "light"
                          ? Colors.light.colors.primary
                          : Colors.dark.colors.primary,
                    }}
                  >
                    {cantidad}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3F75EA",
                    padding: 8,
                    borderRadius: 25,
                    //   marginHorizontal: 5,
                    width: 40,
                    height: 40,
                  }}
                  onPress={sumarCant}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      marginTop: 1,
                      textAlign: "center",
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </TouchableOpacity>

      
        <ModalItemCant
          isModalVisible={visible}
          setModalVisible={setVisible}
          tittle="Cantidad:"
          itemToEdit={cantidad}
          save={(c: number) => setFromModal(c)}
          saveText={"Guardar"}
        />
      </>
    );
  }
);

export default ItemProduct;
