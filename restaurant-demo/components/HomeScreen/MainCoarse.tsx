import React, { useRef } from "react";
import { useState } from "react";
import { FC } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Image as PNG,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { View, Text, Image, ScrollView } from "react-native";
import { connect } from "react-redux";
import { deleteFood, addFood, subtractFood } from "../../Redux/Actions/food";
import { ADDTOCART, HOMESCREEN } from "../../utils/constants";
import { ICartInput, IMainCoarse } from "../../utils/interface";
import { getProductInfo } from "../../AlanManager";
import {
  useScrollIntoView,
} from 'react-native-scroll-into-view';
import { useEffect } from "react";

const MainCoarse: FC<IMainCoarse> = ({
  mainCoarse,
  index,
  add,
  sub,
  deleteItem,
  currentValue,
  highlightedItemId,
  scrolledItemId
}) => {
  const scrollIntoView = useScrollIntoView();
  const viewRef = useRef<any>(null);

  useEffect(() => {
    if (mainCoarse.id === scrolledItemId) {
      console.info('scrollIntoView');
      scrollIntoView(viewRef.current)
    }
  }, [scrolledItemId]);

  useEffect(() => {
    if (mainCoarse.id === highlightedItemId) {
      console.info('highlightedItemId');

      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.spring(animation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }, 400)

    }
  }, [highlightedItemId]);

  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, 1.06];
  const scale = animation.interpolate({ inputRange, outputRange });

  return (
    <Animated.View ref={viewRef} style={[styles.container, mainCoarse.id === highlightedItemId ? styles.containerActive : {}, { transform: [{ scale }] }]}>
      <View style={styles.constainerView}>
        <View>
          <Text style={styles.name}>{mainCoarse.product_name}</Text>
          <View style={styles.containerView}>
            <Text style={styles.discountPrice}>
              ${mainCoarse.product_discounted_cost}
            </Text>
            <Text style={styles.mrp}>${mainCoarse.product_cost}</Text>
            <Text style={styles.discount}>
              {(
                ((Number(mainCoarse.product_cost) -
                  Number(mainCoarse.product_discounted_cost)) /
                  Number(mainCoarse.product_cost)) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>
          <View style={styles.favourite}>
            <View onTouchEnd={() => {
              getProductInfo(mainCoarse.id);
            }}>
              <Image
                style={styles.df}
                source={require("../../assets/svgImages/info.png")}
              />
            </View>
            {/* <Image
              style={styles.df}
              source={require("../../assets/svgImages/favourite.png")}
            />
            <View style={styles.share}>
              <Image source={require("../../assets/svgImages/share.png")} />
            </View> */}
          </View>
        </View>
        <View style={styles.center}>
          <PNG
            style={styles.itemImage}
            source={{ uri: mainCoarse.image_url }}
          />
          <View style={styles.addSection}>
            {currentValue && !currentValue[mainCoarse.id] ? (
              <Text
                style={styles.addText}
                onPress={() => {
                  add(mainCoarse);
                }}
              >
                {ADDTOCART.add}
              </Text>
            ) : !currentValue ? (
              <>
                <Text
                  style={styles.addText}
                  onPress={() => {
                    add(mainCoarse);
                  }}
                >
                  {ADDTOCART.add}
                </Text>
              </>
            ) : (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.width20}
                  onPress={() => {
                    if ((currentValue[mainCoarse.id].quantity as number) > 1) {
                      sub(mainCoarse);
                    } else {
                      console.log(currentValue[mainCoarse.id].quantity);
                      deleteItem(mainCoarse.id.toString());
                    }
                  }}
                >
                  <Text style={styles.addText}>{ADDTOCART.minus}</Text>
                </TouchableOpacity>
                <Text style={styles.addText}>
                  {currentValue && currentValue[mainCoarse.id].quantity}
                </Text>
                <TouchableOpacity
                  style={styles.addView}
                  onPress={() => {
                    add(mainCoarse);
                  }}
                >
                  <Text style={styles.addText}>{ADDTOCART.plus}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "91%",
    marginBottom: 16,
    marginLeft: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "rgba(0,0,0,0.4)",
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  containerActive: {
    shadowColor: "rgba(0,0,0,1)",
  },
  width20: { width: 20 },
  itemImage: { height: 66, width: 80, borderRadius: 8 },
  addSection: {
    width: 60,
    height: 25,
    borderColor: "#FA4D51",
    borderWidth: 1,
    backgroundColor: "#FFF0F0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -10,
  },
  share: {
    height: 22,
    width: 22,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 0.1,
    marginTop: 1,
  },
  center: { justifyContent: "center", alignItems: "center" },
  df: { marginRight: 20, height: 22, width: 22 },
  favourite: {
    flexDirection: "row",
    marginBottom: 5,
  },
  containerView: { flexDirection: "row", marginBottom: 16 },
  name: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    fontWeight: "500",
    color: "#232527",
    maxWidth: 200,
  },
  addView: { width: 20, alignItems: "flex-end" },
  row: { flexDirection: "row" },
  addText: {
    color: "#FA4D51",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    fontWeight: "700",
  },
  constainerView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  discount: {
    fontSize: 13,
    fontWeight: "400",
    color: "#FF9D00",
    fontFamily: "OpenSans-Regular",
    paddingTop: 5,
  },
  discountPrice: {
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    color: "#4285F4",
    paddingTop: 5,
  },
  mrp: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#BFBFBF",
    paddingTop: 5,
    paddingLeft: 8,
    paddingRight: 16,
    textDecorationLine: "line-through",
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
    highlightedItemId: state.product.highlightedItemId,
    scrolledItemId: state.product.scrolledItemId
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteItem: (key: string) => dispatch(deleteFood(key)),
    add: (item: ICartInput) => dispatch(addFood(item)),
    sub: (item: ICartInput) => dispatch(subtractFood(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainCoarse);
