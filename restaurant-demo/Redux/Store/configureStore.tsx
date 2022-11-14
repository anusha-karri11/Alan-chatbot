import { createStore, combineReducers } from "redux";
import foodReducer from "../Reducers/foodReducer";
import productReducer from "../Reducers/productReducer";

const rootReducer = combineReducers({
  foodReducer: foodReducer,
  product: productReducer,
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
