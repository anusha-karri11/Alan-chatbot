import { ICartInput } from "../../utils/interface";
import {
  ADD_AUTH,
  ADD_FOOD,
  AMOUNT,
  CHAT,
  CLEAR,
  DELETE_FOOD,
  ORDER,
  SUB_FOOD,
} from "./types";

export const addFood = (food: ICartInput) => ({
  type: ADD_FOOD,
  data: food,
});

export const subtractFood = (food: ICartInput) => ({
  type: SUB_FOOD,
  data: food,
});

export const deleteFood = (key: string) => {
  return {
    type: DELETE_FOOD,
    data: key,
  };
};

export const clearData = (key: string) => {
  return {
    type: CLEAR,
    data: key,
  };
};

export const chatData = (key: number) => {
  return {
    type: CHAT,
    data: key,
  };
};

export const addAuth = (key: string) => {
  return {
    type: ADD_AUTH,
    data: key,
  };
};

export const amount = (key: number) => {
  return {
    type: AMOUNT,
    data: key,
  };
};

export const orderId = (key: string) => {
  return {
    type: ORDER,
    data: key,
  };
};

