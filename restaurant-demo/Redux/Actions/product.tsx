import { ICartInput } from "../../utils/interface";
import { HIGHLIGHT, PRODUCT, RECOMMENDED, RECOMMENDEDPRODUCT, RESET_HIGHLIGHT, SCROLL_TO_ITEM } from "./types";

export const addProduct = (key: ICartInput[]) => {
  return {
    type: PRODUCT,
    data: key,
  };
};

export const viewRecommended = (key: number) => {
  return {
    type: RECOMMENDED,
    data: key,
  };
};

export const viewRecommendedProduct = (key: ICartInput[]) => {
  return {
    type: RECOMMENDEDPRODUCT,
    data: key,
  };
};

export const scrollToItem = (key: string) => {
  return {
    type: SCROLL_TO_ITEM,
    data: key,
  };
};

export const highlightItem = (key: string) => {
  return {
    type: HIGHLIGHT,
    data: key,
  };
};

export const resetItemHighlighting = (key: string) => {
  return {
    type: RESET_HIGHLIGHT,
  };
};
