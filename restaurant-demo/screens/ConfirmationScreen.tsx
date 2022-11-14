import React, { useState } from "react";
import { FC } from "react";
import { View, Text, Image as GIF, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { clearData } from "../Redux/Actions/food";
import { connect } from "react-redux";
import { OrderDetail } from "../utils/interface";
import { CONFIRMATION } from "../utils/constants";

const ConfirmationScreen: FC<OrderDetail> = ({ navigation, route, clear }) => {
  const [timer, setTimer] = useState(10);
  const { orderID } = route.params;
  useEffect(() => {
    if (timer === 0) {
      clear("");
      navigation.navigate("HomeScreen");
    }
  }, [timer]);
  useEffect(() => {
    const interval = setInterval(() => {
      return setTimer((timer) => {
        return timer - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <View style={styles.waiter}>
          <Image source={require("../assets/svgImages/waiterSuccess.png")} />
        </View>
        <View>
          <GIF
            style={styles.successGif}
            source={require("../assets/svgImages/successTick.gif")}
          ></GIF>
        </View>
        <View style={styles.awesomeView}>
          <Text style={styles.awesome}>{CONFIRMATION.awesome}</Text>
        </View>
        <Text style={styles.accepted}>{CONFIRMATION.accepted}</Text>
        <Text style={styles.orderId}>#{orderID}</Text>
        <Text style={styles.patience}>
          {CONFIRMATION.patience}
          <Text style={styles.time}>{CONFIRMATION.min}</Text>
          <Text style={styles.track}>{CONFIRMATION.trackNavigation}</Text>
          {CONFIRMATION.later}
        </Text>
        <View style={styles.remarksView}>
          <Text style={styles.remark}>{CONFIRMATION.message}</Text>
          <Text style={styles.redirected}>
            {CONFIRMATION.redirected}{" "}
            <Text style={styles.timer}>
              {timer} {CONFIRMATION.sec}
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  successGif: { height: 150, width: 150, marginVertical: 30 },
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "transparent" : "white",
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  track: {
    fontSize: 16,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#4285F4",
    textDecorationLine: "underline",
  },
  awesomeView: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: "#F4F7FA",
    borderRadius: 150,
  },
  waiter: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 32,
  },
  awesome: {
    fontSize: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#4285F4",
  },
  accepted: {
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#232527",
    marginTop: 30,
  },
  orderId: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    color: "#00388C",
    marginTop: 4,
  },
  patience: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6E757C",
    fontFamily: "OpenSans-Regular",
    marginTop: 32,
    maxWidth: "70%",
    textAlign: "center",
  },
  time: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    color: "#6E757C",
  },
  remarksView: {
    position: "absolute",
    bottom: 42,
    alignItems: "center",
  },
  remark: {
    fontSize: 12,
    fontWeight: "400",
    color: "#232527",
    fontFamily: "OpenSans-Regular",
    marginBottom: 16,
  },
  redirected: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#999999",
  },
  timer: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#00CC00",
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    clear: (key: string) => dispatch(clearData(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationScreen);
