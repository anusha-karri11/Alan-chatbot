import { HIGHLIGHT, PRODUCT, RECOMMENDED, RECOMMENDEDPRODUCT, RESET_HIGHLIGHT, SCROLL_TO_ITEM } from "../Actions/types";

const initialState = {
  productItems: [],
  index: 0,
  recommended: [],
};

const productReducer = (
  state = initialState,
  action: { type: any; data: any; key: any }
) => {
  switch (action.type) {
    case PRODUCT:
      return {
        ...state,
        productItems: action.data,
      };
    case RECOMMENDED:
      return {
        ...state,
        index: action.data,
      };
    case RECOMMENDEDPRODUCT:
      return {
        ...state,
        recommended: action.data,
      }; 
    case SCROLL_TO_ITEM:
      return {
        ...state,
        scrolledItemId: action.data,
      }; 
    case HIGHLIGHT:
      return {
        ...state,
        highlightedItemId: action.data,
      }; 
    case RESET_HIGHLIGHT:
      return {
        ...state,
        highlightedItemId: null,
        scrolledItemId: null,
      }; 
    default:
      return state;
  }
};

export default productReducer;
