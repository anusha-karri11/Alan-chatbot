import React, { useEffect, useState } from "react";
import { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  StyleSheet,
  Image,
} from "react-native";
import CheckBox from "react-native-check-box";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAuth } from "../../Redux/Actions/food";
import { connect } from "react-redux";
import { LoginComponentInterface } from "../../utils/interface";
import { login } from "../../axios/api";
import { LOGINPAGE } from "../../utils/constants";
import { useToast } from "react-native-toast-notifications";

const LoginComponent: FC<LoginComponentInterface> = ({
  onClick,
  addAuth,
  navigation,
}) => {
  const [checkbox, seCheckBox] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const toast = useToast();

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>{LOGINPAGE.welcome}</Text>
          <TouchableOpacity
            onPress={() => {
              onClick();
            }}
          >
            <Image
              style={styles.close}
              source={require("../../assets/svgImages/close.png")}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeading}>{LOGINPAGE.foodie}</Text>
        <View style={styles.margin}>
          <View style={styles.row}>
            <Text style={styles.name}>{LOGINPAGE.username}</Text>
            <Text style={styles.star}>{LOGINPAGE.star}</Text>
          </View>
          <View style={styles.nameSection}>
            <View style={styles.svgView}>
              <Image
                style={styles.nameSvg}
                source={require("../../assets/svgImages/username.png")}
              />
            </View>
            <TextInput
              style={styles.nameTextInput}
              placeholder={LOGINPAGE.namePlaceholder}
              placeholderTextColor={"#C9CCCF"}
              editable
              onChangeText={(e) => {
                setUsername(e);
              }}
            />
          </View>
        </View>
        <View>
          <View style={styles.textSection}>
            <Text style={styles.pwdText}>{LOGINPAGE.password}</Text>
            <Text style={styles.star}>{LOGINPAGE.star}</Text>
          </View>
          <View style={styles.pwdTextInputView}>
            <View style={styles.prefixView}>
              <Image
                style={styles.pwdPrefixImage}
                source={require("../../assets/svgImages/password.png")}
              />
            </View>
            <TextInput
              secureTextEntry={!showPwd}
              style={styles.pwdTextInput}
              placeholder={LOGINPAGE.pwdPlaceholder}
              placeholderTextColor={"#C9CCCF"}
              editable
              onChangeText={(e) => {
                setPassword(e);
              }}
            />

            <View
              style={styles.pwdImage}
              onTouchEnd={() => {
                setShowPwd(!showPwd);
              }}
            >
              <Image
                style={styles.viewPwd}
                source={require("../../assets/svgImages/viewPassword.png")}
              />
            </View>
          </View>
        </View>
        <View style={styles.forgotView}>
          <CheckBox
            style={styles.flex}
            onClick={() => {
              seCheckBox(!checkbox);
            }}
            isChecked={checkbox}
            rightText={LOGINPAGE.remember}
            rightTextStyle={{ color: "#9D9D9D", fontSize: 13 }}
            checkBoxColor={"#9D9D9D"}
          />
          <Text style={styles.forgot}>{LOGINPAGE.forgot}</Text>
        </View>
        <View
          style={styles.loginButton}
          onTouchEnd={() => {
            const formData = new FormData();
            formData.append("username", username.toLowerCase());
            formData.append("password", password);
            console.log(formData);

            login(
              formData,
              (response) => {
                console.log(response);
                AsyncStorage.setItem(
                  "authorization",
                  `Bearer ${response.data.access_token}`
                ).then(() => {
                  addAuth(`Bearer ${response.data.access_token}`);
                  onClick();
                  navigation.navigate("HomeScreen");
                });
              },
              () => {
                toast.show(LOGINPAGE.toast);
                // ToastAndroid.showWithGravity(LOGINPAGE.toast, 4, 10);
              }
            );
          }}
        >
          <Text style={styles.login}>{LOGINPAGE.login}</Text>
        </View>
        <View style={styles.signUpSection}>
          <Text style={styles.noAccount}>{LOGINPAGE.noAccount}</Text>
          <Text style={styles.signUp}>{LOGINPAGE.signUp}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  textSection: { flexDirection: "row", marginTop: 16 },
  container: { marginHorizontal: 32, marginTop: 30 },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 22,
    color: "#232527",
  },
  close: {
    height: 20,
    width: 20,
  },
  subHeading: {
    fontWeight: "400",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    color: "#868C92",
    marginTop: 10,
  },
  margin: { marginTop: 48 },
  name: {
    color: "#232527",
    fontFamily: "OpenSans-Regular",
    fontWeight: "600",
    fontSize: 14,
  },
  row: { flexDirection: "row" },
  nameSection: { flexDirection: "row", marginTop: 6 },
  svgView: {
    height: 50,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    borderTopColor: "rgba(0, 0, 0, 0.12)",
    borderLeftColor: "rgba(0, 0, 0, 0.12)",
    borderRightColor: "#F6F8FB",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  nameSvg: {
    height: 18,
    width: 15,
    alignSelf: "center",
  },
  nameTextInput: {
    padding: 8,
    height: 50,
    width: "88%",
    marginRight: 32,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    borderTopColor: "rgba(0, 0, 0, 0.12)",
    borderRightColor: "rgba(0, 0, 0, 0.12)",
    borderLeftColor: "#F6F8FB",

    backgroundColor: "#F6F8FB",
    textAlignVertical: "center",
  },
  pwdText: {
    color: "#232527",
    fontFamily: "OpenSans-Regular",
    fontWeight: "600",
    fontSize: 14,
  },
  star: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontWeight: "600",
    fontSize: 14,
  },
  pwdTextInputView: {
    flexDirection: "row",
    marginTop: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  prefixView: {
    height: 50,
    width: 40,
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    borderTopColor: "rgba(0, 0, 0, 0.12)",
    borderLeftColor: "rgba(0, 0, 0, 0.12)",
    borderRightColor: "#F6F8FB",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pwdPrefixImage: {
    height: 17,
    width: 18,
    marginLeft: 3,
  },
  pwdTextInput: {
    padding: 8,
    height: 50,
    width: "75%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    borderTopColor: "rgba(0, 0, 0, 0.12)",
    borderRightColor: "#F6F8FB",
    borderLeftColor: "#F6F8FB",
    backgroundColor: "#F6F8FB",
    textAlignVertical: "center",
  },
  pwdImage: {
    height: 50,
    width: 40,
    paddingTop: 20,
    paddingLeft: 8,
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    borderTopColor: "rgba(0, 0, 0, 0.12)",
    borderRightColor: "rgba(0, 0, 0, 0.12)",
    borderLeftColor: "#F6F8FB",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  viewPwd: {
    height: 8,
    width: 14,
  },
  forgotView: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  forgot: {
    alignSelf: "flex-end",
    fontFamily: "OpenSans-Regular",
    fontSize: 13,
    color: "#4285F4",
  },
  flex: { flex: 1 },
  loginButton: {
    height: 48,
    marginTop: 30,
    width: 328,
    backgroundColor: "#4267B2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  login: {
    flex: 1,
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 12,
  },
  signUpSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  noAccount: {
    color: "#9D9D9D",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    marginRight: 8,
  },
  signUp: {
    color: "#4267B2",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    textDecorationLine: "underline",
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
