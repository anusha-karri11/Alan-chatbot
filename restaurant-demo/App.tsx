import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider } from "react-redux";

import { AlanView } from '@alan-ai/alan-sdk-react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { addFood, deleteFood } from "./Redux/Actions/food";
import { ICartInput } from "./utils/interface";
import * as RootNavigation from './navigation/RootNavigation';
import { StackActions } from "@react-navigation/native";
import { highlightItem, resetItemHighlighting, scrollToItem } from "./Redux/Actions/product";
import store from "./Redux/Store/store";
import { sendStoreToState } from "./AlanManager";

const { AlanManager, AlanEventEmitter } = NativeModules;
const alanEventEmitter = new NativeEventEmitter(AlanEventEmitter);



const mapDispatchToProps = (dispatch: any) => {
  return {
    add: (item: ICartInput) => dispatch(addFood(item)),
    deleteItem: (key: string) => dispatch(deleteFood(key)),
    scrollToItem: (key: string) => dispatch(scrollToItem(key)),
    highlightItem: (key: string) => dispatch(highlightItem(key)),
    resetItemHighlighting: (key: string) => dispatch(resetItemHighlighting(key)),
  };
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    store.subscribe(() => {
      sendStoreToState(store);
    });
    const commandSubscription = alanEventEmitter.addListener('command', (data) => {
      console.log(`ALAN: got command event ${JSON.stringify(data)}`);
      if (data.command === 'add-food') {
        mapDispatchToProps(store.dispatch).add(data.item);
      }
      if (data.command === 'delete-food') {
        mapDispatchToProps(store.dispatch).deleteItem(data.itemId);
      }
      if (data.command === 'scroll-to-item') {
        mapDispatchToProps(store.dispatch).scrollToItem(data.itemId);
        setTimeout(() => {
          mapDispatchToProps(store.dispatch).highlightItem(data.itemId);
          setTimeout(() => {
            mapDispatchToProps(store.dispatch).resetItemHighlighting(data.itemId);
          }, 600);
        }, 1000);
      }
      if (data.command === 'open-cart') {
        console.info('open-cart')
        RootNavigation.navigate('CartScreen');
      }
      if (data.command === 'go-back') {
        const popAction = StackActions.pop(1);
        RootNavigation.navigationRef.dispatch(popAction);
      }
      if (data.command === 'procceed-to-pay') {
        RootNavigation.navigate('PaymentScreen');
      }

    });
    const btnStateSubscription = alanEventEmitter.addListener('onButtonState', (state) => {
      if(state === 'ONLINE'){
        AlanManager.setVisualState({ "data": store.getState() });
      }
    });
    return function cleanup() {
      commandSubscription.remove();
      btnStateSubscription.remove();
    };
  });

  console.disableYellowBox = true;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <ToastProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
            <AlanView projectid={'7d70721cdb761a304d0bf347580da6fd2e956eca572e1d8b807a3e2338fdd0dc/stage'} authData={{}} />
          </SafeAreaProvider>
        </ToastProvider>
      </Provider>
    );
  }
}
