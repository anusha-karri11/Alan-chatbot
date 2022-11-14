import React from "react";
import { FC } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { PAYMENT } from "../../utils/constants";
import { IPaymentMethod } from "../../utils/interface";

const PaymentMethod: FC<IPaymentMethod> = ({
  paymentMethodImage,
  paymentMethodText,
  isRightArrowIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={paymentMethodImage} />
        <Text style={styles.method}>{paymentMethodText}</Text>
      </View>
      {isRightArrowIcon ? (
        <Image source={require("../../assets/svgImages/rightArrow.png")} />
      ) : (
        <Text style={styles.eligible}>{PAYMENT.eligible}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  method: {
    color: "#1C1834",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 8,
  },
  eligible: {
    color: "#4285F4",
    fontFamily: "OpenSans-Regular",
    fontSize: 10,
    fontWeight: "400",
  },
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(209, 222, 234, 0.25)",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: { flexDirection: "row" },
});

export default PaymentMethod;
