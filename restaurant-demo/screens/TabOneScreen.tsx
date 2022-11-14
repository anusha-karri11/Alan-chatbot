import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  PermissionsAndroid,
} from "react-native";
import AWS from "aws-sdk/dist/aws-sdk-react-native";
import { RootTabScreenProps } from "../types";
import * as Speech from "expo-speech";
// import SpeechToText from "react-native-google-speech-to-text";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";

AWS.config.region = "us-east-1"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:891dc1aa-1835-4c39-bffe-f22637ca2d5f",
});

let lexRunTime = new AWS.LexRuntime();
let lexUserId = "mediumBot" + Date.now();

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputEnabled, setInputEnabled] = useState(true);

  const renderTextItem = (item: any) => {
    let style, responseStyle;
    if (item.from === "bot") {
      style = styles.botMessages;
      responseStyle = styles.responseContainer;
    } else {
      style = styles.userMessages;
      responseStyle = {};
    }
    return (
      <View style={responseStyle}>
        <Text style={style}>{item.msg}</Text>
      </View>
    );
  };

  const [results, setResults] = useState<any>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    function onSpeechResults(e: SpeechResultsEvent) {
      setResults(e.value ?? []);
      if (e.value) {
        let oldMessages: any = messages;
        oldMessages.push({ from: "user", msg: e.value[0] });
        setMessages(oldMessages);
        setUserInput("");
        setInputEnabled(false);
        sendToLex(e.value[0]);
      }
    }

    function onSpeechError(e: SpeechErrorEvent) {
      console.error(e);
    }
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return function cleanup() {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const showResponse = (lexResponse: any) => {
    let lexMessage = lexResponse.message;
    let oldMessages: any = messages;
    oldMessages.push({ from: "bot", msg: lexMessage });
    setMessages(oldMessages);
    Speech.speak(lexMessage);
    setInputEnabled(true);
  };

  const sendToLex = (message: string) => {
    let params = {
      botAlias: "orderBot",
      botName: "OrderBot_vtwo",
      inputText: message,
      userId: lexUserId,
    };
    lexRunTime.postText(params, (err: any, data: any) => {
      if (err) {
        // TODO SHOW ERROR ON MESSAGES
      }
      if (data) {
        showResponse(data);
      }
    });
  };

  const showRequest = (inputText: any) => {
    // Add text input to messages in state
    let oldMessages: any = messages;
    oldMessages.push({ from: "user", msg: inputText });
    setMessages(oldMessages);
    setUserInput("");
    setInputEnabled(false);
    sendToLex(inputText);
  };

  const handleTextSubmit = () => {
    let inputText = userInput.trim();
    if (inputText !== "") showRequest(inputText);
  };
  const speechToTextHandler = async () => {
    let speechToTextData = null;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        speechToTextData = await Voice.start("en-US");
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      console.log("Camera permission denied");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.messages}>
        <FlatList
          data={messages}
          renderItem={({ item }) => renderTextItem(item)}
          extraData={messages}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setUserInput(text)}
          value={userInput}
          style={styles.textInput}
          editable={inputEnabled}
          placeholder={"Type here to talk!"}
          autoFocus={true}
          onSubmitEditing={handleTextSubmit}
        />
        <Button
          onPress={() => {
            speechToTextHandler();
          }}
          title="Speaks"
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messages: {
    flex: 1,
    marginTop: 20,
  },
  botMessages: {
    color: "black",
    backgroundColor: "white",
    padding: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 0,
    borderTopRightRadius: 20,
    alignSelf: "flex-start",
    bottom: 23,
    textAlign: "left",
    width: "75%",
  },
  userMessages: {
    backgroundColor: "#40AD4D",
    color: "white",
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "65%",
    alignSelf: "flex-end",
    textAlign: "left",
  },
  textInput: {
    flex: 2,
    paddingLeft: 15,
  },
  responseContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#EEEFFA",
  },
});
