export interface IBottomNavBar {
  navigation: any;
  chatNumber: number;
}

export interface IMainCoarse {
  currentValue: { [key: string]: ICartInput };
  deleteItem: (key: string) => void;
  add: (key: ICartInput) => void;
  sub: (key: ICartInput) => void;
  navigation?: any;
}

export interface IMainCoarse {
  mainCoarse: {
    product_name: string;
    product_cost: number;
    product_discounted_cost: string;
    image_url: string;
    id: number;
    index?: number;
  };
  deleteItem: (key: string) => void;
  add: (key: ICartInput) => void;
  sub: (key: ICartInput) => void;
  index: number;
  recommendedItem: ICartInput[];
  currentValue: { [key: string]: ICartInput };
  highlightedItemId: number;
  scrolledItemId: number;
}

export interface LoginComponentInterface {
  onClick: () => void;
  addAuth: (key: string) => void;
  navigation: any;
}
export interface IPaymentMethod {
  paymentMethodImage: any;
  paymentMethodText: string;
  isRightArrowIcon: boolean;
}
export interface ICartInput {
  product_name: string;
  product_cost: number;
  product_discounted_cost: string;
  id: number;
  image_url: any;
  quantity?: number;
  discount?: string;
  description?: string;
  food_class?: string
}
export interface CartValue {
  currentValue: { [key: string]: ICartInput };
  amount: (key: number) => {};
  navigation: any;
}
export interface IChatBot {
  navigation: any;
  authorization: string;
  chatData: (key: number) => void;
}
export interface OrderDetail {
  clear: (key: string) => void;
}

export interface ICartValue {
  currentValue: { [key: string]: ICartInput };
  productItems: ICartInput[];
  navigation: any;
  recommendedItems: ICartInput[];
  addProductItems: (key: ICartInput[]) => void;
  viewRecommended: (key: number) => void;
  viewRecommendedProduct: (key: ICartInput[]) => void;
}

export interface CartValuePaymentSuccess {
  navigation: any;
  amount: number;
  authorization: string;
  currentValue: { [key: string]: ICartInput };
  orderID: (key: string) => string;
}

export interface IPaymentApi {
  item: { item_name: string; price: number };
  quantity: number | undefined;
}
