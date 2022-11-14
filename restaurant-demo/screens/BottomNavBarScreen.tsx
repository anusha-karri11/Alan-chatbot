import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { FC } from "react";
import useColorScheme from "../hooks/useColorScheme";
import { RootTabParamList, RootTabScreenProps } from "../types";
import Colors from "../constants/Colors";
import HomeScreen from "./HomeScreen";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import ChatBot from "./ChatBotScreen";

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator: FC = () => {
  const colorScheme = useColorScheme();
  const TabBarIcon = (props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }) => {
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
  };

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={ChatBot}
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};
