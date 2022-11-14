import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { addFood, deleteFood, subtractFood } from "../../Redux/Actions/food";
import { ADDTOCART, HOMESCREEN } from "../../utils/constants";
import { ICartInput, IMainCoarse } from "../../utils/interface";

const SpecialCuisine: FC<IMainCoarse> = ({ deleteItem, add, sub }) => {
  const [quantity, setQuantity] = useState(0);

  return (
    <View>
      <ImageBackground
        style={styles.constainer}
        source={require("../../assets/svgImages/burgerImage.jpg")}
        imageStyle={{
          height: 184,
          width: "91.5%",
          justifyContent: "center",
          alignSelf: "center",
          marginLeft: 16,
          borderRadius: 16,
        }}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={[
            {
              position: "absolute",
              left: 0,
              marginLeft: 16,
              right: 0,
              top: 0,
              borderRadius: 16,
              width: "91.5%",
              height: 185,
            },
          ]}
        />
        <View style={styles.ratingSection}>
          <Image
            style={styles.star}
            source={require("../../assets/svgImages/star.png")}
          />
          <Image
            style={styles.star}
            source={require("../../assets/svgImages/star.png")}
          />
          <Image
            style={styles.star}
            source={require("../../assets/svgImages/star.png")}
          />
          <Image
            style={styles.star}
            source={require("../../assets/svgImages/star.png")}
          />
          <Image
            style={styles.star}
            source={require("../../assets/svgImages/star.png")}
          />
          <Text style={styles.ratingText}>{HOMESCREEN.rating}</Text>
          <Text style={styles.review}>{HOMESCREEN.reviews}</Text>
        </View>
      </ImageBackground>
      <View style={styles.couponSection}>
        <Text style={styles.coupon}>
          {HOMESCREEN.coupon}
          <Text style={styles.code}> {HOMESCREEN.code}</Text>{" "}
          {HOMESCREEN.offerCuisine}
        </Text>
        <View style={styles.addSection}>
          {quantity === 0 ? (
            <Text
              style={styles.addText}
              onPress={() => {
                setQuantity(quantity + 1);
                add({
                  product_name: "Special Cuisine Burger",
                  product_cost: 16.5,
                  product_discounted_cost: "13.20",
                  discount: "10% OFF",
                  id: 15647343,
                  image_url: require("../../assets/svgImages/burgerImage.jpg"),
                });
              }}
            >
              {ADDTOCART.add}
            </Text>
          ) : (
            <View style={styles.row}>
              <TouchableOpacity style={styles.width30}>
                <Text
                  style={styles.sub}
                  onPress={() => {
                    if (quantity > 1) {
                      sub({
                        product_name: "Special Cuisine Burger",
                        product_cost: 16.5,
                        product_discounted_cost: "13.20",
                        discount: "10% OFF",
                        id: 15647343,
                        image_url: require("../../assets/svgImages/burgerImage.jpg"),
                      });
                    } else {
                      deleteItem("15647343");
                    }
                    setQuantity(quantity - 1);
                  }}
                >
                  {ADDTOCART.minus}
                </Text>
              </TouchableOpacity>
              <Text style={styles.addText}>{quantity}</Text>
              <TouchableOpacity style={styles.addItemSection}>
                <Text
                  style={styles.addText}
                  onPress={() => {
                    add({
                      product_name: "Special Cuisine Burger",
                      product_cost: 16.5,
                      product_discounted_cost: "13.20",
                      discount: "10% OFF",
                      id: 15647343,
                      image_url: require("../../assets/svgImages/burgerImage.jpg"),
                    });
                    setQuantity(quantity + 1);
                  }}
                >
                  {ADDTOCART.plus}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingText: {
    paddingLeft: 4,
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontWeight: "700",
    fontSize: 10,
  },
  sub: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
    paddingLeft: 8,
  },
  couponSection: {
    marginTop: 8,
    marginLeft: 16,
    flexDirection: "row",
    marginRight: 19,
    justifyContent: "space-between",
    alignItems: "center",
  },
  width30: { width: 30 },
  addItemSection: {
    width: 30,
    paddingRight: 5,
    alignItems: "flex-end",
  },
  row: { flexDirection: "row" },
  addText: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  addSection: {
    width: 80,
    height: 27,
    borderColor: "#FA4D51",
    borderWidth: 1,
    backgroundColor: "#FFF0F0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  code: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
  },
  coupon: {
    color: "#4D4D4C",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "400",
    maxWidth: 200,
  },
  review: {
    paddingLeft: 4,
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontWeight: "700",
    fontSize: 10,
  },
  ratingSection: {
    marginLeft: 27,
    marginBottom: 12,
    marginRight: 30,
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
  },
  constainer: {
    height: 184,
    width: "100%",
    borderRadius: 20,
  },
  star: { height: 12, width: 12 },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteItem: (key: string) => dispatch(deleteFood(key)),
    add: (item: ICartInput) => dispatch(addFood(item)),
    sub: (item: ICartInput) => dispatch(subtractFood(item)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SpecialCuisine);
