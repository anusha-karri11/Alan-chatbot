import React, { useState } from "react";
import { FC } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItems from "../components/CartItems/CartItems";
import { useEffect } from "react";
import { getTaxOnTotal } from "../utils/getTaxOnTotal";
import { getDiscount } from "../utils/getDiscount";
import { StackActions } from "@react-navigation/native";
import { getTotalAmount } from "../utils/getTotalAmount";
import { connect } from "react-redux";
import { amount } from "../Redux/Actions/food";
import { CartValue } from "../utils/interface";
import { CART } from "../utils/constants";

const CartScreen: FC<CartValue> = ({ navigation, currentValue, amount }) => {
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [total, setTotal] = useState<any>(getTotalAmount(currentValue));
  console.log(currentValue);

  useEffect(() => {
    setTotal(getTotalAmount(currentValue));
  }, [currentValue]);

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <View>
            <View style={styles.headerSection}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  const popAction = StackActions.pop(1);
                  navigation.dispatch(popAction);
                }}
              >
                <View style={styles.backArrow}>
                  <Image
                    style={styles.back}
                    source={require("../assets/svgImages/backArrow.png")}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.heading}>{CART.cart}</Text>
              <View></View>
            </View>
            <View>
              <Text style={styles.yourOrder}>{CART.order}</Text>
            </View>
            <CartItems navigation={navigation} />
            <View>
              <Text style={styles.offeers}>{CART.benefits}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setApplyCoupon(true);
              }}
            >
              <View style={styles.couponSection}>
                <View>
                  <Text style={styles.applyCoupon}>{CART.coupon}</Text>
                  <Text style={styles.saveMoney}>
                    {CART.save}{" "}
                    <Text style={styles.discountDisplay}>
                      ${getDiscount(total).toFixed(2)}
                    </Text>{" "}
                    {CART.with} <Text style={styles.new}>{CART.code}</Text>
                  </Text>
                </View>

                <Image
                  style={styles.right}
                  source={require("../assets/svgImages/rightArrow.png")}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.amountSection}>
              <View style={styles.subTotalView}>
                <Text style={styles.subTotalText}>{CART.subTotal}</Text>
                <Text style={styles.subTotal}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.taxView}>
                <Text style={styles.taxText}>{CART.tax}</Text>
                <Text style={styles.tax}>
                  ${getTaxOnTotal(total).toFixed(2)}
                </Text>
              </View>
              {applyCoupon ? (
                <View style={styles.couponView}>
                  <Text style={styles.coupon}>
                    {CART.appliedCoupon}{" "}
                    <Text style={styles.tryNew}>{CART.appliedCode}</Text>
                  </Text>
                  <Text style={styles.discount}>
                    ${getDiscount(total).toFixed(2)}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              <View style={styles.totalView}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.total}>
                  $
                  {applyCoupon
                    ? (
                        total +
                        getTaxOnTotal(total) -
                        getDiscount(total)
                      ).toFixed(2)
                    : (total + getTaxOnTotal(total)).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={styles.button}
            onTouchEnd={() => {
              amount(
                applyCoupon
                  ? (total + getTaxOnTotal(total) - getDiscount(total)).toFixed(
                      2
                    )
                  : (total + getTaxOnTotal(total)).toFixed(2)
              );
              navigation.push("PaymentScreen");
            }}
          >
            <Text style={styles.proceed}>{CART.button}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  back: { height: 18, width: 20 },
  right: { marginRight: 18, width: 6, height: 12 },
  scrollView: { backgroundColor: "#fff" },
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "transparent" : "white",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  backArrow: {
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
  heading: {
    fontSize: 18,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#232527",
  },
  yourOrder: {
    color: "#232527",
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    marginTop: 16,
  },
  offeers: {
    color: "#232527",
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    marginTop: 40,
  },
  couponSection: {
    marginBottom: 16,
    marginTop: 8,
    paddingVertical: 10,
    backgroundColor: "rgba(209, 222, 234, 0.25)",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  applyCoupon: {
    color: "#60666C",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    marginLeft: 10,
    lineHeight: 16,
  },
  saveMoney: {
    color: "#60666C",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 10,
    fontFamily: "OpenSans-Regular",
  },
  discountDisplay: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 10,
    fontFamily: "OpenSans-Regular",
  },
  new: {
    color: "#FA4D51",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    marginLeft: 10,
  },
  amountSection: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 18,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  subTotalView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTotalText: {
    color: "#1C1834",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    marginLeft: 10,
  },
  subTotal: {
    color: "#6E757C",
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
  },
  taxView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  taxText: {
    color: "#1C1834",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 10,
    fontFamily: "OpenSans-Regular",
  },
  tax: {
    color: "#6E757C",
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
  },
  couponView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  coupon: {
    color: "#4285F4",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "open-sans-semibold",
    marginLeft: 10,
  },
  tryNew: {
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
  },
  discount: {
    color: "#6E757C",
    fontSize: 13,
    fontFamily: "open-sans-semibold",
    fontWeight: "600",
  },
  totalView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalText: {
    color: "#1C1834",
    fontSize: 17,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    marginLeft: 10,
  },
  total: {
    color: "#341818",
    fontSize: 17,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
  },
  button: {
    height: 48,
    marginTop: 30,
    marginBottom: 32,
    backgroundColor: "#4267B2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  proceed: {
    flex: 1,

    color: "#fff",
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    fontSize: 15,
    marginTop: 11,
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    amount: (key: number) => dispatch(amount(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
