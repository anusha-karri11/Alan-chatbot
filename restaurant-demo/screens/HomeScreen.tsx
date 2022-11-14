import React, { useState } from "react";
import { FC } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Items from "../assets/json/recommendedFood.json";
import { LinearGradient } from "expo-linear-gradient";
import MainCoarse from "../components/HomeScreen/MainCoarse";
import SpecialCuisine from "../components/HomeScreen/specialCuisine";
import SpecialOffers from "../components/HomeScreen/specialOffers";
import { useEffect } from "react";
import { connect } from "react-redux";
import { deleteFood } from "../Redux/Actions/food";
import BottomNavBar from "../components/BottomSection/BottomSection";
import { addProduct, viewRecommended, viewRecommendedProduct } from "../Redux/Actions/product";
import { ICartInput, ICartValue } from "../utils/interface";
import { getCall } from "../axios/api";
import { HOMESCREEN, PRODUCTDESCRIPTION } from "../utils/constants";
import {
  wrapScrollView,
  useScrollIntoView,
  wrapScrollViewConfigured,
} from 'react-native-scroll-into-view';

const CustomScrollView = wrapScrollViewConfigured({
  options: {
    insets: {
      top: 40,
      bottom: 140,
    },
  },
})(ScrollView);;

const itemGenre = [
  "Recomended",
  "Beverages",
  "Vegan",
  "Breads",
  "Burgers",
  "Side Items",
  "Meal",
];

const HomeScreen: FC<ICartValue> = ({
  navigation,
  currentValue,
  productItems,
  recommendedItems,
  addProductItems,
  viewRecommended,
  viewRecommendedProduct
}) => {
  const [selectedGenere, setSelectedGenere] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [mainItems, setMainItems] = useState(productItems);

  useEffect(() => {
    if (searchInput.length === 0) {
      setMainItems(productItems);
    } else {
      const filter = productItems.filter((item) =>
        item.product_name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setMainItems(filter);
    }
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      getCall("dev/inv/api/products", {}, (response) => {
        addProductItems(response["data"]);
      });
      getCall("dev/inv/api/product/recommendations/user", {}, (response) => {
        viewRecommendedProduct(response["data"]);
      });
    })();
  }, []);

  useEffect(() => {
    setMainItems(productItems);
  }, [productItems]);

  return (
    <SafeAreaView style={styles.flex}>
      <BottomNavBar navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={styles.hamburger}>
            <Image source={require("../assets/svgImages/hamburger.png")} />
          </View>
          <View style={styles.center}>
            <Text style={styles.location}>{HOMESCREEN.location}</Text>
            <View style={styles.row}>
              <Image source={require("../assets/svgImages/location.png")} />
              <Text style={styles.geo}>{HOMESCREEN.geo}</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (currentValue) {
                navigation.push("CartScreen");
              }
            }}
          >
            <View
              style={[
                styles.cart,
                {
                  paddingLeft: currentValue ? 3 : 0,
                },
              ]}
            >
              <Image source={require("../assets/svgImages/cart.png")} />
              {currentValue ? <View style={styles.activeCart} /> : <></>}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.searchView}>
          <View style={styles.searchSection}>
            <Image
              style={styles.search}
              source={require("../assets/svgImages/search.png")}
            />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={HOMESCREEN.search}
            placeholderTextColor={"#C9CCCF"}
            editable
            onChangeText={(data) => {
              setSearchInput(data);
            }}
          />
        </View>
        {productItems.length === 0 || viewRecommendedProduct.length === 0 ? (
          <View style={styles.loader}>
            <ActivityIndicator color={"rgba(0,0,0,0.7)"} />
          </View>
        ) : (
          <CustomScrollView showsVerticalScrollIndicator={false}>
            {searchInput.length === 0 ? (
              <View style={styles.rec}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {itemGenre.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.recScrollView,
                          {
                            backgroundColor:
                              index === selectedGenere ? "#0088ff" : "#F6F8FB",
                          },
                        ]}
                        onTouchEnd={() => {
                          setSelectedGenere(index);
                        }}
                      >
                        <Text
                          style={[
                            styles.recText,
                            {
                              color:
                                index === selectedGenere ? "#fff" : "#BFBFBF",
                            },
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <></>
            )}
            {searchInput.length === 0 ? (
              <View style={styles.recSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recommendedItems.map((item, index) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          viewRecommended(index);
                          navigation.push("ProductDescription", {
                            index: index,
                          });
                        }}
                        key={index}
                      >
                        <View key={index} style={styles.margin16}>
                          <ImageBackground
                            source={{uri: item.image_url}}
                            style={styles.bgImage}
                            imageStyle={{ borderRadius: 16 }}
                          >
                            <LinearGradient
                              // Background Linear Gradient
                              colors={["transparent", "rgba(0,0,0,0.8)"]}
                              style={[styles.gradient]}
                            />
                            <View style={styles.textView}>
                              <Text style={styles.name}>{item.product_name}</Text>
                              <Text style={styles.time}>{"30 Min | 1 Serving"}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <></>
            )}
            {mainItems.length > 0 ? (
              <Text style={styles.mainCourse}>{HOMESCREEN.main}</Text>
            ) : (
              <Text style={styles.noItem}>{HOMESCREEN.noItem}</Text>
            )}
            <View>
              {mainItems.map((item, index) => {
                if (index >= 10 && !showMore) {
                  if (index === 10) {
                    return (
                      <Text
                        style={styles.showAll}
                        key={index}
                        onPress={() => {
                          setShowMore(true);
                        }}
                      >
                        {HOMESCREEN.showMore}
                      </Text>
                    );
                  } else {
                    return <View key={index}></View>;
                  }
                } else {
                  return (
                    <View key={index}>
                      <MainCoarse mainCoarse={item} index={index} />
                    </View>
                  );
                }
              })}
            </View>
            {searchInput.length === 0 ? (
              <View>
                <Text style={styles.cuisine}>{HOMESCREEN.cuisine}</Text>
                <SpecialCuisine />
                <Text style={styles.exclusive}>{HOMESCREEN.offer}</Text>
                <SpecialOffers />
              </View>
            ) : (
              <></>
            )}
          </CustomScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  rec: {
    marginTop: 26,
    marginLeft: 16,
  },
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "transparent" : "white",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 24,
    marginBottom: Platform.OS === "ios" ? 30 : 60,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
  },
  hamburger: {
    height: 36,
    width: 36,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 6,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  center: { justifyContent: "center", alignItems: "center" },
  location: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    color: "#9D9D9D",
  },
  row: { flexDirection: "row" },
  geo: {
    fontSize: 11,
    color: "#232527",
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    paddingLeft: 5,
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
  cart: {
    height: 36,
    width: 36,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 16,
    elevation: 6,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    flexDirection: "row",
  },
  searchView: {
    flexDirection: "row",
    marginTop: 24,
    marginRight: 14,
    marginLeft: 16,
    paddingBottom: 10,
  },
  searchSection: {
    height: 50,
    width: 40,
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderColor: "#F6F8FB",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    height: 22,
    width: 22,
    marginLeft: 7,
  },
  textInput: {
    padding: 8,
    paddingLeft: 19,
    height: 50,
    width: "88%",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,

    borderColor: "#F6F8FB",

    backgroundColor: "#F6F8FB",
    textAlignVertical: "center",
  },
  loader: { justifyContent: "center", alignItems: "center", flex: 1 },
  recSection: { marginTop: 24, marginLeft: 16 },
  recText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "open-sans-semibold",
  },
  recScrollView: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,

    marginRight: 8,
  },
  textView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  margin16: {
    marginRight: 16,
  },
  bgImage: {
    width: 172,
    height: 220,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    borderRadius: 16,
    height: 220,
  },
  name: {
    fontWeight: "700",
    fontSize: 14,
    color: "#fff",
    width: 120,
    fontFamily: "OpenSans-Regular",
    paddingLeft: 16,
  },
  time: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
    fontFamily: "open-sans-semibold",
    paddingTop: 5,
    paddingLeft: 16,
    paddingBottom: 10,
  },
  cuisine: {
    marginTop: 32,
    marginBottom: 16,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    fontSize: 20,
    marginLeft: 16,
  },
  mainCourse: {
    marginTop: 32,
    marginBottom: 16,
    fontFamily: "OpenSans-Regular",
    fontWeight: "700",
    fontSize: 21,
    marginLeft: 16,
  },
  noItem: {
    height: "100%",
    justifyContent: "center",
    fontFamily: "OpenSans-Regular",
    alignSelf: "center",
    color: "rgba(0,0,0,0.5)",
  },
  showAll: {
    fontWeight: "600",
    fontSize: 14,
    color: "#4267B2",
    fontFamily: "open-sans-semibold",
    textDecorationLine: "underline",
    justifyContent: "center",
    alignSelf: "center",
  },
  exclusive: {
    marginTop: 32,
    marginBottom: 16,
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    fontSize: 20,
    marginLeft: 16,
  },
});

const mapStateToProps = (state: any) => {
  return {
    currentValue: state.foodReducer.foodItems,
    productItems: state.product.productItems,
    recommendedItems: state.product.recommended,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    delete: (key: string) => dispatch(deleteFood(key)),
    addProductItems: (key: ICartInput[]) => dispatch(addProduct(key)),
    viewRecommended: (key: number) => dispatch(viewRecommended(key)),
    viewRecommendedProduct: (key: ICartInput[]) => dispatch(viewRecommendedProduct(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
