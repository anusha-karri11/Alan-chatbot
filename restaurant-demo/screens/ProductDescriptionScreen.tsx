import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FC } from "react";

import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ingredient, nutritionFact } from "../assets/json/mainCoarse";
import { StackActions } from "@react-navigation/native";
import { addFood, deleteFood, subtractFood } from "../Redux/Actions/food";
import { connect } from "react-redux";
import BottomNavBar from "../components/BottomSection/BottomSection";
import { ICartInput, IMainCoarse } from "../utils/interface";
import { ADDTOCART } from "../utils/constants";

const ProductDescription: FC<IMainCoarse> = ({
  navigation,
  currentValue,
  deleteItem,
  add,
  sub,
  index,
  recommendedItem,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState("");

  const description = recommendedItem[index].description;

  useEffect(() => {
    setText(description as string);
  }, []);
  useEffect(() => {
    if (showMore) {
      setText(description as string);
    } else {
      const dots = (description as string).length > 120 ? "... " : "";
      setText((description as string).substring(0, 120) + dots);
    }
  }, [showMore]);



  return (
    <SafeAreaView style={styles.flex}>
      <BottomNavBar navigation={navigation} />
      <View style={styles.touchableView}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            const popAction = StackActions.pop(1);
            navigation.dispatch(popAction);
          }}
        >
          <View style={styles.backView}>
            <Image
              style={styles.backImage}
              source={require("../assets/svgImages/backArrow.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentValue) {
              navigation.push("CartScreen");
            }
          }}
        >
          <View
            style={[styles.cartImage, { paddingLeft: currentValue ? 3 : 0 }]}
          >
            <Image source={require("../assets/svgImages/cart.png")} />
            {currentValue ? <View style={styles.activeCart} /> : <></>}
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <ImageBackground
            source={{uri: recommendedItem[index].image_url}}
            style={styles.bgImage}
            resizeMode="stretch"
          >
            <LinearGradient
              // Background Linear Gradient
              colors={["transparent", "rgba(0,0,0,0.5)"]}
              style={styles.gradient}
            />

            <View style={styles.servingSection}>
              <Text style={styles.serving}>
                {"30 Min | 1 Serving"}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.headingText}>
            <Text style={styles.heading}>{recommendedItem[index].product_name}</Text>
            <View style={styles.reviewSection}>
              <View style={styles.row}>
                <Image
                  style={styles.size15}
                  source={require("../assets/svgImages/star.png")}
                />
                <Text style={styles.total}>
                  {4.4}
                </Text>
                <Text style={styles.review}>
                  {"(395 Reviews)"}
                </Text>
              </View>
              <View style={styles.quantitySection}>
                {!currentValue ||
                (currentValue &&
                  !currentValue[recommendedItem[index].id.toString()]) ||
                (currentValue &&
                  currentValue[recommendedItem[index].id.toString()] &&
                  currentValue[recommendedItem[index].id.toString()]
                    .quantity) === 0 ? (
                  <Text
                    style={styles.add}
                    onPress={() => {
                      add({
                        product_name: recommendedItem[index].product_name,
                        product_cost: recommendedItem[index].product_cost,
                        product_discounted_cost:
                          recommendedItem[index].product_discounted_cost,
                        discount:
                          ((recommendedItem[index].product_cost -
                            Number(
                              recommendedItem[index].product_discounted_cost
                            )) /
                            recommendedItem[index].product_cost) *
                            100 +
                          "% OFF",
                        id: Number(recommendedItem[index].id),
                        image_url: recommendedItem[index].image_url,
                      });
                    }}
                  >
                    {ADDTOCART.add}
                  </Text>
                ) : (
                  <View style={styles.direction}>
                    <TouchableOpacity
                      style={styles.subSection}
                      onPress={() => {
                        if (
                          (currentValue &&
                            currentValue[
                              recommendedItem[index].id.toString()
                            ] &&
                            (currentValue[
                              recommendedItem[index].id.toString()
                            ].quantity as number)) > 1
                        ) {
                          sub({
                            product_name: recommendedItem[index].product_name,
                            product_cost:
                              recommendedItem[index].product_cost,
                            product_discounted_cost:
                              recommendedItem[index].product_discounted_cost,
                            discount:
                              ((recommendedItem[index].product_cost -
                                Number(
                                  recommendedItem[index]
                                    .product_discounted_cost
                                )) /
                                recommendedItem[index].product_cost) *
                                100 +
                              "% OFF",
                            id: Number(recommendedItem[index].id),
                            image_url: recommendedItem[index].image_url,
                          });
                        } else {
                          deleteItem(recommendedItem[index].id.toString());
                        }
                      }}
                    >
                      <Text style={styles.sub}>{ADDTOCART.minus}</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>
                      {currentValue &&
                      currentValue[recommendedItem[index].id.toString()] &&
                      currentValue[recommendedItem[index].id.toString()]
                        .quantity
                        ? currentValue[recommendedItem[index].id.toString()]
                            .quantity
                        : 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.addView}
                      onPress={() => {
                        add({
                          product_name: recommendedItem[index].product_name,
                          product_cost: recommendedItem[index].product_cost,
                          product_discounted_cost:
                            recommendedItem[index].product_discounted_cost,
                          discount:
                            ((recommendedItem[index].product_cost -
                              Number(
                                recommendedItem[index]
                                  .product_discounted_cost
                              )) /
                              recommendedItem[index].product_cost) *
                              100 +
                            "% OFF",
                          id: Number(recommendedItem[index].id),
                          image_url: recommendedItem[index].image_url,
                        });
                      }}
                    >
                      <Text style={styles.addText}>{ADDTOCART.plus}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.margin10}>
              <Text style={styles.productDesc}>
                {text}
                {text.length < (description as string).length ? (
                  <Text
                    style={styles.readMore}
                    onPress={() => {
                      setShowMore(true);
                    }}
                  >
                    {"Read More"}
                  </Text>
                ) : (
                  <></>
                )}
              </Text>
            </View>
            <View style={styles.top24}>
              <Text style={styles.ingredientText}>
                {"Top Ingredients"}
              </Text>
              <View style={styles.ingredientMap}>
                {ingredient.map((item, index2) => {
                  if (index2 === 0 && (recommendedItem[index].food_class as string)==='Veg') {
                    return <View />;
                  } else {
                    return (
                      <View key={index2} style={styles.ingredientImage}>
                        <Image source={item} />
                      </View>
                    );
                  }
                })}
              </View>
            </View>
            <View style={styles.top24}>
              <Text style={styles.nutritionFact}>
                {"Nutrition Facts"}
              </Text>
              <View style={styles.nutritionMap}>
                {nutritionFact.map((item, index) => {
                  return (
                    <View key={index} style={styles.nutritionData}>
                      <Text style={styles.value}>{item.value}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.margin24}>
              <Text style={styles.allergenHeading}>
                {"Allergen Information"}
              </Text>
              <View style={styles.margin8}>
                <Text style={styles.allergenSubHeading}>
                  {"Thick Cut Applewood Smoked Bacon"}
                </Text>
                <Text style={styles.allergenInfo}>
                  {"Ingredients: Nuggets, Ketchup"}
                </Text>
                <Text style={styles.salted}>
                  {"Salted Butter"}{" "}
                </Text>
                <Text style={styles.ingredient}>
                  {"Ingredients: Cream, Salt."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeCart: {
    height: 8,
    width: 8,
    borderRadius: 30,
    backgroundColor: "#FA4D51",
    borderWidth: 2,
    borderColor: "#fff",
    marginLeft: -5,
    marginTop: -9,
  },
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "transparent" : "white",
  },
  container: { backgroundColor: "white", marginBottom: 60 },
  bgImage: {
    height: Dimensions.get("window").height / 2,
    width: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height / 2,
  },
  touchableView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: -60,
    zIndex: 3,
    marginLeft: 16,
    marginTop: 24,
  },
  backView: {
    position: "absolute",
    height: 36,
    width: 36,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  backImage: { height: 18, width: 20 },
  cartImage: {
    height: 36,
    width: 36,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    flexDirection: "row",
  },
  servingSection: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 15,
    marginLeft: 26,
  },
  headingText: { marginTop: 26, marginHorizontal: 16, marginBottom: 20 },
  heading: {
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 18,
    color: "#232527",
  },
  serving: {
    fontSize: 13,
    fontFamily: "open-sans-semibold",
    fontWeight: "600",
    color: "#fff",
  },
  reviewSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },
  size15: { height: 15, width: 15 },
  total: {
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 13,
    color: "#000",
    marginLeft: 5,
  },
  review: {
    fontWeight: "400",
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    color: "#B3B3B3",
    marginLeft: 4,
  },
  quantitySection: {
    width: 80,
    height: 35,
    backgroundColor: "#F6F8FB",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    color: "#232527",
    fontFamily: "open-sans-semibold",
    fontSize: 12,
    fontWeight: "600",
  },
  direction: { flexDirection: "row" },
  subSection: {
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 10,
  },
  sub: {
    color: "#C9CCCF",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  quantity: {
    color: "#232527",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  addView: {
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    marginLeft: 10,
    borderRadius: 10,
  },
  addText: {
    color: "#000",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  margin10: { marginTop: 10 },
  productDesc: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "open-sans-semibold",
    color: "#919396",
    lineHeight: 20,
  },
  readMore: {
    color: "#D46C4F",
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
  },
  ingredientMap: { flexDirection: "row", marginTop: 18 },
  ingredientText: {
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 18,
    color: "#232527",
  },
  ingredientImage: {
    height: 70,
    width: 70,
    borderRadius: 8,
    backgroundColor: "#F6F8FB",
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingLeft: 8,
  },
  nutritionFact: {
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 18,
    color: "#232527",
  },
  top24: { marginTop: 24 },
  nutritionMap: { flexDirection: "row", marginTop: 8 },
  nutritionData: { marginRight: 24, alignItems: "flex-start" },
  value: {
    fontSize: 16,
    fontFamily: "open-sans-semibold",
    fontWeight: "600",
    color: "#919396",
  },
  description: {
    fontSize: 9,
    fontFamily: "open-sans-semibold",
    fontWeight: "600",
    color: "#919396",
  },
  margin24: { marginTop: 24 },
  margin8: { marginTop: 8 },
  allergenHeading: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    fontSize: 18,
    color: "#232527",
  },
  allergenSubHeading: {
    color: "#919396",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  allergenInfo: {
    color: "#919396",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 4,
  },
  salted: {
    color: "#919396",
    fontSize: 12,
    fontFamily: "open-sans-semibold",
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 16,
  },
  ingredient: {
    color: "#919396",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 2,
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
    index: state.product.index,
    recommendedItem: state.product.recommended,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteItem: (key: string) => dispatch(deleteFood(key)),
    add: (item: ICartInput) => dispatch(addFood(item)),
    sub: (item: ICartInput) => dispatch(subtractFood(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDescription);
