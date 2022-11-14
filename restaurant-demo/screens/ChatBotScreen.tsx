import React, { useEffect, useRef, useState } from "react";
import { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image as PngImage,
  PermissionsAndroid,
  TouchableOpacity,
  Image as GIF,
  Dimensions,
  Modal,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AWS from "aws-sdk/dist/aws-sdk-react-native";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import { useToast } from "react-native-toast-notifications";
import BottomNavBar from "../components/BottomSection/BottomSection";
import { StackActions, useNavigationState } from "@react-navigation/native";
import { connect } from "react-redux";
import { chatData } from "../Redux/Actions/food";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IChatBot } from "../utils/interface";
import { postCall } from "../axios/api";
import { request, PERMISSIONS, RESULTS, check } from "react-native-permissions";



const ChatBot: FC<IChatBot> = ({ navigation, authorization, chatData }) => {
  const [messages, setMessages] = useState([
    { from: "bot", msg: "Welcome Daniel 👋 I’m Bot Carie" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [inputEnabled, setInputEnabled] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [results, setResults] = useState<any>([]);
  const [isListening, setIsListening] = useState(false);
  const toast = useToast();
  const [lex, setLex] = useState("mediumBot" + Date.now());
  const messagesEndRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const routesLength = useNavigationState((state) => state.routes.length);
  const [authDetail, setAuthDetail] = useState(authorization);
  const [load, setLoad] = useState(false);
  const [order, setOrder] = useState(0);
  const [iosData, setIosData] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (authorization.length === 0) {
        setAuthDetail((await AsyncStorage.getItem("authorization")) as string);
      }
    })();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const onSpeechVolumeChanged = (e: any) => {
    if (Platform.OS === "ios") {
      var timer;
      if (e.value > 1) {
        clearTimeout(timer);
      }
      if (e.value < 1) {
        timer = setTimeout(() => {
          Voice.stop();
        }, 2000);
      }
      console.log("onSpeechVolumeChanged: ", e);
    }
    //Invoked when pitch that is recognized changed
  };
  function onSpeechResults(e: SpeechResultsEvent) {
    console.log("popop");
    if (Platform.OS === "android") {
      setResults(e.value ?? []);

      if (e.value) {
        let speechToTextMessage = "";
        console.log(e.value);
        console.log("jdfidsf");
        console.log(e.value);
        console.log(messages[messages.length - 1]);
        if (
          messages &&
          messages[messages.length - 1].msg &&
          messages[messages.length - 1].msg.includes("quantity")
        ) {
          for (var i = 0; i < e.value.length; i++) {
            if (parseInt(e.value[i])) {
              speechToTextMessage = e.value[i];
              i = e.value.length + 1;
            }
          }
        } else {
          speechToTextMessage = e.value[0];
        }
        if (speechToTextMessage.length === 0) {
          speechToTextMessage = e.value[0];
        }
        if (speechToTextMessage) {
          let oldMessages = messages;
          oldMessages.push({ from: "user", msg: speechToTextMessage });
          setMessages(oldMessages);
          setUserInput("");
          setInputEnabled(false);
          setShowLoading(true);
          sendToLex(speechToTextMessage);
          setIsListening(false);
        }
      }
    } else {
      console.log("popop2");
      console.log(e.value);

      if (e.value) {
        iosData.push(e.value[0]);
      }
    }
  }
  function onSpeechEnd() {
    console.log("here3");
    setIsListening(false);
    if (Platform.OS === "ios") {
      let oldMessages = messages;
      oldMessages.push({ from: "user", msg: iosData[iosData.length - 1] });
      setMessages(oldMessages);
      setUserInput("");
      setInputEnabled(false);
      setShowLoading(true);
      sendToLex(iosData[iosData.length - 1]);
      setIsListening(false);
    }
  }
  function onSpeechError(e: SpeechErrorEvent) {
    console.log("here2");

    setIsListening(false);
    Voice.stop();
    toast.show("Couldn't understand, Please try again");
    console.error(e);
  }

  const startVoice = async () => {
    let speechToTextData = null;

    try {
      setIsListening(true);
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
      console.log("here");
      speechToTextData = await Voice.start(
        Platform.OS === "android" ? "en-US" : "en-GB"
      );
    } catch (error) {
      setIsListening(false);
      Voice.stop();
      toast.show("Couldn't understand, Please try again ");
    }
  };

  const checkAndRequestPermission = async () => {
    check(PERMISSIONS.IOS.MICROPHONE)
      .then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            startVoice();
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.MICROPHONE).then((result) => {
              switch (result) {
                case RESULTS.GRANTED:
                  startVoice();
                  break;
              }
            });
            break;
          default:
            setIsListening(false);
            toast.show("Please provide Audio Permission");
            break;
        }
      })
      .catch((error) => {});
  };

  const speechToTextHandler = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startVoice();
      } else {
        setIsListening(false);
        toast.show("Please provide Audio Permission");
      }
    } else {
      checkAndRequestPermission();
    }
  };

  useEffect(() => {
    setIsListening(false);
  }, [load]);

  const renderTextItem = (
    item: { from: string; msg: string },
    index: number
  ) => {
    let style, responseStyle;
    if (item.from === "bot") {
      style = styles.botMessages;
      responseStyle = styles.responseContainer;
    } else {
      style = styles.userMessages;
      responseStyle = styles.requestContainer;
    }
    return (
      <View>
        <View style={responseStyle}>
          {item.from === "bot" ? (
            <Image
              style={styles.imageSize}
              source={require("../assets/svgImages/botImage.png")}
            />
          ) : (
            <></>
          )}
          <Text style={style}>{item.msg}</Text>
          {item.from !== "bot" ? (
            <PngImage
              style={styles.imageSize}
              source={require("../assets/svgImages/userAvatar.png")}
            />
          ) : (
            <></>
          )}
        </View>
        {item.from !== "bot" && showLoading && index === messages.length - 1 ? (
          <View style={styles.responseContainer}>
            <Image
              style={styles.imageSize}
              source={require("../assets/svgImages/botImage.png")}
            />
            <View style={styles.loading}>
              <View style={styles.circle}></View>
              <View style={[styles.circle, styles.margin6]}></View>
              <View style={styles.circle}></View>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  const purchaseApi = async (lexResponse: any) => {
    const items = [];
    if (lexResponse.slots.DrinkItems.length > 0) {
      items.push({
        item: {
          item_name: lexResponse.slots.DrinkItems,
          price: 10,
        },
        quantity: lexResponse.slots.QtyDrinkItems,
      });
    }
    if (lexResponse.slots.MainItems.length) {
      items.push({
        item: {
          item_name: lexResponse.slots.MainItems,
          price: 10,
        },
        quantity: lexResponse.slots.QtyMainItems,
      });
    }
    if (lexResponse.slots.SideItems.length) {
      items.push({
        item: {
          item_name: lexResponse.slots.SideItems,
          price: 10,
        },
        quantity: lexResponse.slots.QtySideItems,
      });
    }

    postCall(
      "dev/cons/api/order",
      {
        order_summary: {
          vendor_name: "Panera",
          status: "New",
          total_amount: "10",
        },
        order_items: [...items],
      },
      {},
      (response) => {
        Speech.speak(`Thanks for shopping with us.`, {
          language: "en-US",
        });
        setOrder(response["data"][0]["order_summary"]["id"]);
        chatData(0);
        setLoad(true);
      }
    );
  };

  const showRequest = (inputText: any) => {
    // Add text input to messages in state
    let oldMessages: any = messages;
    oldMessages.push({ from: "user", msg: inputText });
    setMessages(oldMessages);
    setShowLoading(true);
    setUserInput("");
    setInputEnabled(false);

    sendToLex(inputText);
  };
  const showResponse = (lexResponse: any) => {
    let lexMessage = lexResponse.message;
    let oldMessages: any = messages;
    oldMessages.push({ from: "bot", msg: lexMessage });
    setMessages(oldMessages);
    setShowLoading(false);
    // Speech.speak(lexMessage, {
    //   language: "en-US",
    //   onDone: () => {
    //     if (
    //       (lexResponse.dialogState !== "Fulfilled" ||
    //         lexResponse.intentName === "helloIntent") &&
    //       lexResponse.dialogState !== "Failed"
    //     ) {
    //       // speechToTextHandler();
    //     }
    //   },
    // });
    setInputEnabled(true);
    if (
      lexResponse.dialogState === "Fulfilled" &&
      lexResponse.intentName !== "helloIntent"
    ) {
      purchaseApi(lexResponse);
    } else if (lexResponse.dialogState === "Failed") {
      chatData(0);
    }
  };

  const sendToLex = (message: string) => {
    let params = {
      botAlias: "orderBot",
      botName: "OrderBot_vthree",
      inputText: message,
      userId: lex,
    };
    lexRunTime.postText(params, (err: any, data: any) => {
      if (err) {
        setIsListening(false);
        Voice.stop();
        toast.show("Couldn't understand, Please try again after some time");
      }
      if (data) {
        chatData(routesLength);
        showResponse(data);
      }
    });
  };

  const handleTextSubmit = () => {
    let inputText = userInput.trim();
    if (inputText !== "") showRequest(inputText);
  };

  // const recordingOptions = {
  //   // android not currently in use, but parameters are required
  //   android: {
  //     extension: ".m4a",
  //     outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
  //     audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
  //     sampleRate: 44100,
  //     numberOfChannels: 2,
  //     bitRate: 128000,
  //   },
  //   ios: {
  //     extension: ".wav",
  //     audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
  //     sampleRate: 44100,
  //     numberOfChannels: 1,
  //     bitRate: 128000,
  //     linearPCMBitDepth: 16,
  //     linearPCMIsBigEndian: false,
  //     linearPCMIsFloat: false,
  //   },
  //   web: {},
  // };

  // const startRecording = async () => {
  //   // this.setState({ isRecording: true });

  //   // some of these are not applicable, but are required
  //   await Audio.setAudioModeAsync({
  //     allowsRecordingIOS: true,
  //     playsInSilentModeIOS: true,
  //     shouldDuckAndroid: true,
  //     playThroughEarpieceAndroid: true,
  //   });
  //   const recording = new Audio.Recording();
  //   try {
  //     await recording.prepareToRecordAsync(recordingOptions);
  //     await recording.startAsync();
  //   } catch (error) {
  //     console.log(error);
  //     recording.stopAndUnloadAsync();
  //   }
  //   setRecording(recording);
  // };

  // const getTranscription = async () => {
  //   this.setState({ isFetching: true });
  //   try {
  //     const info = await FileSystem.getInfoAsync(this.recording.getURI());
  //     console.log(`FILE INFO: ${JSON.stringify(info)}`);
  //     const uri = info.uri;
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri,
  //       type: 'audio/x-wav',
  //       // could be anything
  //       name: 'speech2text'
  //     });
  //     const response = await fetch(config.CLOUD_FUNCTION_URL, {
  //       method: 'POST',
  //       body: formData
  //     });
  //     const data = await response.json();
  //     this.setState({ query: data.transcript });
  //   } catch(error) {
  //     console.log('There was an error', error);
  //     this.stopRecording();
  //     this.resetRecording();
  //   }
  //   this.setState({ isFetching: false });
  // }

  return (
    <SafeAreaView style={styles.flex}>
      <Modal
        transparent={true}
        visible={load}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Your order id is #{order}. Thanks for shopping with us.
            </Text>
            <View style={styles.exit}>
              <Pressable
                onPress={() => {
                  setLoad(false);
                  const popAction = StackActions.pop(1);
                  navigation.dispatch(popAction);
                }}
              >
                <Text style={styles.textStyleCancel}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <BottomNavBar navigation={navigation} />
      <View style={styles.header}>
        <View style={styles.headerSection}>
          <View></View>
          <Text style={styles.chatData}>Chatbot</Text>
          <View></View>
        </View>
        <View style={styles.container}>
          <View style={styles.messages}>
            <FlatList
              ref={messagesEndRef}
              data={messages}
              renderItem={({ item, index }) => renderTextItem(item, index)}
              extraData={messages}
              onContentSizeChange={() =>
                messagesEndRef.current.scrollToEnd({ animated: true })
              }
            />
          </View>
        </View>
        {isListening ? (
          <View style={styles.gifView}>
            <GIF
              style={styles.gif}
              source={require("../assets/svgImages/voice.gif")}
            ></GIF>
          </View>
        ) : (
          <></>
        )}
        <View style={styles.bgWhite}>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(text) => setUserInput(text)}
              value={userInput}
              style={styles.textInput}
              editable={inputEnabled}
              placeholder={"Message"}
              autoFocus={true}
              onSubmitEditing={handleTextSubmit}
            />
            <TouchableOpacity
              onPress={() => {
                speechToTextHandler();
              }}
            >
              <View style={styles.microphoneView}>
                <Image
                  style={styles.microphone}
                  source={require("../assets/svgImages/microphone.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gif: { height: 60, width: Dimensions.get("window").width },
  bgWhite: { backgroundColor: "white" },
  chatData: {
    fontSize: 18,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#232527",
  },
  gifView: {
    elevation: 5,
    paddingTop: 10,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
  },
  microphone: {
    height: 25,
    width: 25,
  },
  header: {
    backgroundColor: "#fff",
    flex: 1,
    marginBottom: Platform.OS === "ios" ? 30 : 60,
  },
  loading: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    marginBottom: 10,
    marginLeft: 12,
    elevation: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "transparent" : "white",
  },
  circle: {
    height: 12,
    width: 12,
    borderRadius: 20,
    backgroundColor: "rgba(27, 117, 187, 0.4)",
  },
  microphoneView: {
    marginRight: 10,
  },
  imageSize: { height: 32, width: 32 },
  messages: {
    flex: 1,
    marginTop: 20,
  },
  exit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  botMessages: {
    color: "black",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    marginLeft: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 8,
    fontFamily: "OpenSans-Regular",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    maxWidth: "70%",
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowColor: "rgba(0,0,0,0.5)",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleCancel: {
    color: "#2196F3",
    fontWeight: "bold",
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
  },
  margin6: { marginHorizontal: 6 },
  userMessages: {
    backgroundColor: "white",
    color: "black",
    padding: 10,
    marginBottom: 10,
    marginRight: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 0,
    fontFamily: "OpenSans-Regular",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignSelf: "flex-end",
    textAlign: "left",
    maxWidth: "70%",
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowColor: "rgba(0,0,0,0.5)",
  },
  textInput: {
    paddingLeft: 16,
    flex: 2,
  },
  responseContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
    marginLeft: 16,
  },
  requestContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
    marginRight: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    height: 48,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: "#F6F8FB",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
    fontSize: 16,
    fontWeight: "400",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    marginLeft: 20,
  },
});

const mapStateToProps = (state: any) => {
  return {
    authorization: state.foodReducer.authorization,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    chatData: (key: any) => dispatch(chatData(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBot);
