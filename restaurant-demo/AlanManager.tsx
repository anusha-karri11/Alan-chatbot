import { NativeModules } from 'react-native';

const { AlanManager } = NativeModules;

export function getProductInfo(productId: number) {
  console.info('CALL getProductInfo method with productId: ', productId);
  AlanManager.activate();
  AlanManager.callProjectApi(
    'script::getProductInfo', { "productId": productId },
    (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    },
  )
}

export function sendStoreToState(store: any) {
  console.info('VS was sent to voice script');
  AlanManager.setVisualState({ "data": JSON.parse(JSON.stringify(store.getState())) });
}