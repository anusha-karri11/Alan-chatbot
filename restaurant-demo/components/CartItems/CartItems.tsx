import React from "react";
import { useEffect } from "react";
import { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image as PNG,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import { addFood, deleteFood, subtractFood } from "../../Redux/Actions/food";
import { ADDTOCART, CART } from "../../utils/constants";
import { ICartInput, IMainCoarse } from "../../utils/interface";

const CartItems: FC<IMainCoarse> = ({
  currentValue,
  deleteItem,
  add,
  sub,
  navigation,
}) => {
  useEffect(() => {
    if (!currentValue) {
      navigation.push("HomeScreen");
    }
  });
  return (
    <View>
      {currentValue &&
        Object.values(currentValue).map((value: ICartInput) => {
          return (
            <View style={styles.container} key={value.id}>
              <View style={styles.row}>
                {value.image_url.toString().includes("http") ? (
                  <PNG
                    style={styles.itemImage}
                    source={{ uri: value.image_url }}
                  />
                ) : (
                  <PNG style={styles.itemImage} source={value.image_url} />
                )}
                <View style={styles.width67}>
                  <Text style={styles.productName}>{value.product_name}</Text>
                  <Text style={styles.serving}>{CART.serving}</Text>
                  <View style={styles.addSection}>
                    <View style={styles.row}>
                      <TouchableOpacity
                        style={styles.width20}
                        onPress={() => {
                          if (value.quantity && value.quantity > 1) {
                            sub({
                              product_name: value.product_name,
                              product_cost: value.product_cost,
                              product_discounted_cost:
                                value.product_discounted_cost,
                              discount: (
                                ((Number(value.product_cost) -
                                  Number(value.product_discounted_cost)) /
                                  Number(value.product_cost)) *
                                100
                              ).toFixed(2),
                              id: value.id,
                              image_url: value.image_url,
                            });
                          } else {
                            deleteItem(value.id.toString());
                          }
                        }}
                      >
                        <Text style={styles.subtract}>{ADDTOCART.minus}</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{value.quantity}</Text>
                      <TouchableOpacity
                        style={styles.sumView}
                        onPress={() => {
                          add({
                            product_name: value.product_name,
                            product_cost: value.product_cost,
                            product_discounted_cost:
                              value.product_discounted_cost,
                            discount: (
                              ((Number(value.product_cost) -
                                Number(value.product_discounted_cost)) /
                                Number(value.product_cost)) *
                              100
                            ).toFixed(2),
                            id: value.id,
                            image_url: value.image_url,
                          });
                        }}
                      >
                        <Text style={styles.subtract}>{ADDTOCART.plus}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.price}>
                  $
                  {(value.quantity
                    ? Number(value.product_discounted_cost) * value.quantity
                    : Number(value.product_discounted_cost)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 17,
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowColor: "rgba(0,0,0,0.4)",
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  width67: { maxWidth: "67%" },
  row: { flexDirection: "row" },
  price: {
    fontSize: 15,
    fontFamily: "open-sans-semibold",
    fontWeight: "600",
    color: "#4285F4",
  },
  itemImage: {
    height: 80,
    width: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "open-sans-semibold",
    color: "#232527",
  },
  serving: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#232527",
  },
  addSection: {
    width: 60,
    height: 25,
    borderColor: "#FA4D51",
    borderWidth: 1,
    backgroundColor: "#FFF0F0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  width20: { width: 20 },
  subtract: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  quantity: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  sumView: { width: 20, alignItems: "flex-end" },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteItem: (key: string) => dispatch(deleteFood(key)),
    add: (item: ICartInput) => dispatch(addFood(item)),
    sub: (item: ICartInput) => dispatch(subtractFood(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
