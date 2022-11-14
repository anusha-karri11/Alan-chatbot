import {
  StackActions,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import React from "react";
import { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";
import { sendStoreToState } from "../../AlanManager";
import store from "../../Redux/Store/store";
import { IBottomNavBar } from "../../utils/interface";

const navBar = [
  require("../../assets/svgImages/navBarHome.png"),
  require("../../assets/svgImages/navBarProfileDeActivate.png"),
  require("../../assets/svgImages/navBarTrackDeActivate.png"),
  require("../../assets/svgImages/navBarChat.png"),
];

const navBarActions = [
  ()=>{
    sendStoreToState(store);
  },
  ()=>{},
  ()=>{},
  ()=>{},
];

const navBarDeActivated = [
  require("../../assets/svgImages/navBarHomeDeActivated.png"),
  require("../../assets/svgImages/navBarProfileDeActivate.png"),
  require("../../assets/svgImages/navBarTrackDeActivate.png"),
  require("../../assets/svgImages/navBarChatDeActivate.png"),
];

const routeName = ["HomeScreen", "HomeScreen", "HomeScreen", "ChatBot"];

const BottomNavBar: FC<IBottomNavBar> = ({ navigation, chatNumber }) => {
  const route = useRoute();
  const routesLength = useNavigationState((state) => state.routes.length);
  return (
    <View style={styles.container}>
      <View style={styles.containerView}>
        {navBar.map((image, index) => {
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                height: "200%",
                alignItems: "center",
              }}
              key={index}
              onPress={() => {
                navBarActions[index]();
                if (index === 0 && routeName[index] !== route.name) {
                  navigation.push(routeName[index]);
                } else if (index === 3 && routeName[index] !== route.name) {
                  if (chatNumber === 0) {
                    navigation.push(routeName[index]);
                  } else {
                    if (routesLength > chatNumber) {
                      const popAction = StackActions.pop(
                        routesLength - chatNumber
                      );
                      navigation.dispatch(popAction);
                    } else {
                      navigation.push(routeName[index]);
                    }
                  }
                }
              }}
            >
              <View key={index}>
                <Image
                  style={styles.image}
                  source={
                    routeName[index] === route.name
                      ? image
                      : navBarDeActivated[index]
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    paddingVertical: 23,
    backgroundColor: "white",
    width: "100%",
    elevation: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowColor: "rgba(0,0,0,0.8)",
    zIndex: 3,
  },
  image: { width: 19, height: 19 },
  containerView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
const mapStateToProps = (state: any) => {
  return {
    chatNumber: state.foodReducer.chatNumber,
  };
};
export default connect(mapStateToProps)(BottomNavBar);
