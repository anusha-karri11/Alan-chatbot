import { FC, useRef } from "react";
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RBSheet from "react-native-raw-bottom-sheet";
import { useState } from "react";
import LoginComponent from "../components/Login/LoginComponent";
import { LOGINPAGE } from "../utils/constants";
// import * as Google from "expo-google-app-auth";
import { useEffect } from "react";
// import { LoginManager } from "react-native-fbsdk";
import * as Facebook from "expo-facebook";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { googleLogin } from "../axios/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { addAuth } from "../Redux/Actions/food";
import { useToast } from "react-native-toast-notifications";

const LoginScreen: FC = ({ navigation }) => {
  const refRBSheet = useRef();
  const toast = useToast();

  useEffect(() => {
    // GoogleSignin.configure({
    //   webClientId: `331581184159-istb7b9dcdkd187htuktgairujh9d71s.apps.googleusercontent.com`,
    //   forceCodeForRefreshToken: true,
    //   scopes: ["profile", "email"],
    // });
  }, []);

  const signIn = async () => {
    GoogleSignin.configure({
      webClientId:
        "331581184159-emcdltajfufcj5vmo2iev452q8q3h8sv.apps.googleusercontent.com",
      offlineAccess: true,
      iosClientId:
        "331581184159-f9ondjmqua43sk1im42o6afd244s5evf.apps.googleusercontent.com",
    });
    GoogleSignin.hasPlayServices()
      .then((hasPlayService) => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then((userInfo) => {
              console.log(JSON.stringify(userInfo));
              googleLogin(userInfo.idToken as string, (response) => {
                AsyncStorage.setItem(
                  "authorization",
                  `Bearer ${response.data.access_token}`
                ).then(() => {
                  addAuth(`Bearer ${response.data.access_token}`);
                  navigation.navigate("HomeScreen");
                });
              }, () => {
                toast.show(LOGINPAGE.toast);
              });
            })
            .catch((e) => {
              console.log("ERROR IS: " + JSON.stringify(e));
            });
        }
      })
      .catch((e) => {
        console.log("ERROR IS: " + JSON.stringify(e));
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/svgImages/vegetable.png")}
            style={styles.vegetable}
            resizeMode="cover"
          >
            <View style={styles.topImage}>
              <ImageBackground
                source={require("../assets/svgImages/waiterImageLogin.png")}
                style={styles.waiter}
              >
                <Image
                  style={styles.waiterBG}
                  source={require("../assets/svgImages/waiterBG.png")}
                />
              </ImageBackground>
            </View>
            <View style={styles.center}>
              <Text style={styles.experience}>{LOGINPAGE.heading}</Text>
              <Text style={styles.serve}>{LOGINPAGE.subHeading}</Text>
            </View>
            <View style={styles.center}>
              <View style={styles.signUpView}>
                <Text style={styles.signUp}>{LOGINPAGE.signUp}</Text>
              </View>
            </View>
            <View style={styles.center}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.open();
                }}
              >
                <View style={styles.loginButton}>
                  <Text style={styles.login}>{LOGINPAGE.login}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.orSection}>
              <View style={styles.dash} />
              <Text style={styles.or}>{LOGINPAGE.or}</Text>
              <View style={styles.dash} />
            </View>
            <View style={styles.accountView}>
              <View
                onTouchEnd={() => {
                  signIn();
                  console.log("google");
                }}
              >
                <Image
                  style={styles.accountLogin}
                  source={require("../assets/svgImages/googleLogin.png")}
                />
              </View>
              <View
                onTouchEnd={async () => {
                  console.log("facebook");
                  try {
                    await Facebook.initializeAsync({
                      appId: "588421856091885",
                    });
                    const m = await Facebook.logInWithReadPermissionsAsync({
                      permissions: ["public_profile", "email"],
                    });
                    if (m.type === "success") {
                      // Get the user's name using Facebook's Graph API
                      const response = await fetch(
                        `https://graph.facebook.com/me?fields=email,name,id,first_name,picture,last_name&access_token=${m.token}`
                      );
                      console.log(m);
                      console.log(
                        `Hi ${JSON.stringify(await response.json())}!`
                      );
                      Alert.alert("Logged in!", "facebook login successful");
                      // Alert.alert(
                      //   "Logged in!",
                      //   `Hi ${(await response.json()).name}!`
                      // );
                    } else {
                      // type === 'cancel'
                    }
                  } catch (error: any) {
                    console.log(JSON.stringify(error));
                    alert(`Facebook Login Error: ${error.message}`);
                  }
                  // LoginManager.logInWithPermissions(["public_profile"]).then(
                  //   (result: any) => {
                  //     console.log(result);
                  //     if (result.isCancelled) {
                  //       console.log("Login cancelled");
                  //     } else {
                  //       console.log(
                  //         "Login success with permissions: " +
                  //           result.grantedPermissions.toString()
                  //       );
                  //     }
                  //   },
                  //   (error: any) => {
                  //     console.log("Login fail with error: " + error);
                  //   }
                  // );
                }}
              >
                <Image
                  style={styles.accountLogin}
                  source={require("../assets/svgImages/facebookLogin.png")}
                />
              </View>
              <Image
                style={styles.accountLogin}
                source={require("../assets/svgImages/appleLogin.png")}
              />
            </View>
          </ImageBackground>
        </View>
        <RBSheet
          ref={refRBSheet}
          height={500}
          openDuration={500}
          customStyles={{
            container: styles.bottomSheet,
          }}
        >
          <View style={styles.width}>
            <LoginComponent
              navigation={navigation}
              onClick={() => {
                refRBSheet.current.close();
              }}
            />
          </View>
        </RBSheet>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  width: {
    width: Dimensions.get("window").width,
  },
  flex: { flex: 1, backgroundColor: "transparent" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 25,
    backgroundColor: "#111323",
  },
  vegetable: { height: "100%", width: "100%" },
  topImage: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  waiter: {
    width: 282,
    height: 282,
    overflow: "hidden",
  },
  waiterBG: {
    marginTop: -25,
    marginLeft: -20,
    paddingTop: 10,
    height: 300,
    width: 320,
  },
  experience: {
    width: 286,
    fontSize: 26,
    marginTop: 70,
    fontFamily: "OpenSans-Regular",
    fontStyle: "normal",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 33,
    color: "white",
  },
  serve: {
    width: 286,
    marginTop: 16,
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    fontStyle: "normal",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 16,
    color: "#E6E6E6",
  },
  signUpView: {
    height: 48,
    marginTop: 34,
    width: 328,
    backgroundColor: "#4267B2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  signUp: {
    flex: 1,
    color: "#fff",
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    marginTop: 12,
  },
  center: { justifyContent: "center", alignItems: "center" },
  loginButton: {
    height: 48,
    marginTop: 16,
    width: 328,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  login: {
    flex: 1,
    color: "#000",
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    marginTop: 12,
  },
  orSection: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  or: {
    color: "#C7CAD1",
    fontWeight: "400",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",

    marginHorizontal: 15,
  },
  dash: { height: 1, width: 70, backgroundColor: "#747A8B" },
  accountView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: 100,
    marginTop: 24,
  },
  accountLogin: { height: 24, width: 24 },
  bottomSheet: {
    borderTopLeftRadius: 16,
    borderTopEndRadius: 16,
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    addAuth: (key: string) => dispatch(addAuth(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
