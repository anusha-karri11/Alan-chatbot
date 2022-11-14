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
} from "../Actions/types";

type Employee2 = {
  [key: string]: ICartInput;
};
const initialState = {
  foodItems: null,
  authorization: "",
  amount: 0,
  orderID: "",
  chatNumber: 0,
};

const foodReducer = (
  state = initialState,
  action: { type: any; data: any; key: any }
) => {
  switch (action.type) {
    case CHAT:
      return {
        ...state,
        chatNumber: action.data,
      };
    case CLEAR:
      return {
        ...state,
        foodItems: null,
        amount: 0,
        orderID: "",
      };
    case ORDER:
      return {
        ...state,
        orderID: action.data,
      };
    case AMOUNT:
      return {
        ...state,
        amount: action.data,
      };
    case ADD_AUTH:
      return {
        ...state,
        authorization: action.data,
      };
    case ADD_FOOD:
      const m =
        state.foodItems &&
        state.foodItems[(action.data as ICartInput).id] &&
        (state.foodItems[(action.data as ICartInput).id] as ICartInput)
          .quantity;
      (action.data as ICartInput).quantity = m ? (m as number) + 1 : 1;
      const idAdd = action.data.id;
      const cartAdd = { [idAdd]: action.data };
      const newState = {
        authorization: state.authorization,
        foodReducer: {
          ...(state.foodItems as unknown as Employee2),
          ...cartAdd,
        },
      };
      return {
        ...state,
        foodItems: {
          ...(state.foodItems as unknown as Employee2),
          ...cartAdd,
        },
      };
    case SUB_FOOD:
      (action.data as ICartInput).quantity =
        state.foodItems && state.foodItems[(action.data as ICartInput).id]
          ? ((state.foodItems[(action.data as ICartInput).id] as ICartInput)
              .quantity as number) - 1
          : 1;

      const idSub = action.data.id;
      const cartSub = { [idSub]: action.data };
      return state.foodItems
        ? {
            ...state,
            foodItems: { ...(state.foodItems as Employee2), ...cartSub },
          }
        : { ...state };
    case DELETE_FOOD:
      const cartDel: any =
        state &&
        state.foodItems &&
        Object.keys(state.foodItems).reduce((result: any, key) => {
          if (
            state.foodItems &&
            (state.foodItems[key] as ICartInput).id.toString() !==
              action.data.toString()
          ) {
            result.push(state.foodItems[key]);
          }
          return result;
        }, []);
      let cartDel2: Employee2 | {} | null = {};
      cartDel &&
        cartDel.map((item: any) => {
          const t = { [item.id]: item };
          cartDel2 = { ...cartDel2, ...t };
          // cartDel2[item.id] = item;
        });
      console.log(cartDel);
      if (cartDel.length === 0) {
        cartDel2 = null;
      }
      console.log(cartDel2);

      return cartDel2 && state.foodItems
        ? {
            foodItems: cartDel2 ? { ...cartDel2 } : null,
          }
        : {
            foodItems: null,
          };
    default:
      return state;
  }
};

export default foodReducer;
