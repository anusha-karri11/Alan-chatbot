import React, { useEffect, useState } from "react";
import { FC } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cards } from "../assets/json/mainCoarse";
import PaymentMethod from "../components/PaymentScreen/PaymentMethod";
import { connect } from "react-redux";
import { StackActions } from "@react-navigation/native";
import { orderId } from "../Redux/Actions/food";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CartValuePaymentSuccess,
  ICartInput,
  IPaymentApi,
} from "../utils/interface";
import { postCall } from "../axios/api";
import { PAYMENT } from "../utils/constants";
import { useToast } from "react-native-toast-notifications";

const PaymentScreen: FC<CartValuePaymentSuccess> = ({
  navigation,
  amount,
  authorization,
  currentValue,
}) => {
  const toast = useToast();
  const goToConfirmation = () => {
    let items: IPaymentApi[] = [];
    currentValue &&
      Object.values(currentValue).map((item: ICartInput) => {
        const cartItem = {
          item: {
            item_name: item.product_name,
            price: Number(item.product_discounted_cost),
          },
          quantity: item.quantity,
        };
        items.push(cartItem);
      });

    postCall(
      "dev/cons/api/order",
      {
        order_summary: {
          vendor_name: "Panera",
          status: "New",
          total_amount: amount,
        },
        order_items: [...items],
      },
      {},
      (response: any) => {
        orderId(response["data"][0]["order_summary"]["id"]);
        navigation.push("ConfirmationScreen", {
          orderID: response["data"][0]["order_summary"]["id"],
        });
      },
      (response: any) => {
        toast.show("Something went wrong, Please try again after some time");
      }
    );
  };
  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              const popAction = StackActions.pop(1);
              navigation.dispatch(popAction);
            }}
          >
            <View style={styles.backView}>
              <Image
                style={styles.backArrow}
                source={require("../assets/svgImages/backArrow.png")}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.header}>{PAYMENT.payment}</Text>
          <View></View>
        </View>
        <View style={styles.billDetail}>
          <Text style={styles.amount}>{PAYMENT.bill}</Text>
          <Text style={styles.bill}>${amount}</Text>
        </View>
        <Text style={styles.saved}>{PAYMENT.saved}</Text>
        <View style={styles.left}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cards.map((item, index) => {
              return (
                <View key={index} style={styles.right}>
                  <TouchableOpacity
                    onPress={() => {
                      goToConfirmation();
                    }}
                  >
                    <Image style={styles.height80} source={item} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View>
          <Text style={styles.sub}>{PAYMENT.online}</Text>
          <TouchableOpacity
            onPress={() => {
              goToConfirmation();
            }}
          >
            <PaymentMethod
              isRightArrowIcon={false}
              paymentMethodImage={require("../assets/svgImages/paypal.png")}
              paymentMethodText={PAYMENT.paypal}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              goToConfirmation();
            }}
          >
            <PaymentMethod
              isRightArrowIcon
              paymentMethodImage={require("../assets/svgImages/gPay.png")}
              paymentMethodText={PAYMENT.gpay}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              goToConfirmation();
            }}
          >
            <PaymentMethod
              isRightArrowIcon
              paymentMethodImage={require("../assets/svgImages/applePay.png")}
              paymentMethodText={PAYMENT.ipay}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.other}>{PAYMENT.other}</Text>
          <TouchableOpacity
            onPress={() => {
              goToConfirmation();
            }}
          >
            <PaymentMethod
              isRightArrowIcon
              paymentMethodImage={require("../assets/svgImages/cod.png")}
              paymentMethodText={PAYMENT.cod}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <Image
            style={styles.shield}
            source={require("../assets/svgImages/shield.png")}
          />
          <View style={styles.margin8}>
            <Image
              style={styles.imageTick}
              source={require("../assets/svgImages/tick.png")}
            />
          </View>

          <Text style={styles.safe}>{PAYMENT.safe}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  margin8: {
    marginLeft: -7.5,
  },
  shield: { height: 13, width: 10.5 },
  imageTick: { height: 5, width: 5 },
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "transparent" : "white",
  },
  container: { backgroundColor: "#fff", flex: 1 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
  },
  backView: {
    height: 36,
    width: 36,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  backArrow: { height: 18, width: 20 },
  header: {
    fontSize: 18,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#232527",
  },
  billDetail: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(209, 222, 234, 0.25)",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amount: {
    color: "#232527",
    fontFamily: "OpenSans-Regular",
    fontSize: 16,
    fontWeight: "700",
  },
  bill: {
    color: "#4285F4",
    fontFamily: "OpenSans-Regular",
    fontSize: 16,
    fontWeight: "700",
  },
  saved: {
    color: "#232527",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    marginTop: 32,
    marginLeft: 16,
    marginBottom: 10,
  },
  left: { marginLeft: 16 },
  right: { marginRight: 16 },
  height80: { height: 80, width: 130 },
  sub: {
    color: "#232527",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    marginTop: 32,
    marginLeft: 16,
    marginBottom: 10,
  },
  other: {
    color: "#232527",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 24,
    fontFamily: "OpenSans-Regular",
    marginLeft: 16,
    marginBottom: 10,
  },
  bottom: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
  },
  safe: {
    fontFamily: "OpenSans-Regular",
    color: "#60666C",
    fontSize: 8,
    fontWeight: "400",
    marginLeft: 8,
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
    amount: state.foodReducer.amount,
    authorization: state.foodReducer.authorization,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    orderID: (key: string) => dispatch(orderId(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);
