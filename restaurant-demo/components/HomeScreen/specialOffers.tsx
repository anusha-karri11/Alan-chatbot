import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FC } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { offers, offersImage } from "../../assets/json/mainCoarse";

const SpecialOffers: FC = () => {
  return (
    <View>
      {offers.map((item, index) => {
        return (
          <View key={index}>
            <ImageBackground
              style={styles.container}
              imageStyle={styles.border20}
              source={offersImage[index]}
            >
              <LinearGradient
                // Background Linear Gradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={[
                  {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    borderRadius: 16,
                    height: 220,
                  },
                ]}
              />
              <View style={styles.inner}>
                <Text style={styles.heading}>{item.offerHeading}</Text>
                <View>
                  <Text style={styles.offer}>{item.offer}</Text>
                  <Text style={styles.description}>
                    {item.offerDescription}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 184,
    overflow: "hidden",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    flex: 1,
  },
  inner: {
    justifyContent: "space-around",
    flex: 1,
    marginLeft: 20,
    maxWidth: 150,
  },
  description: {
    fontSize: 8,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  offer: {
    fontSize: 27,
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    color: "#FFFFFF",
  },
  heading: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  border20: { borderRadius: 20 },
});

export default SpecialOffers;
