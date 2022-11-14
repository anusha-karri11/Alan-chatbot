import { ICartInput } from "./interface";

export const getTotalAmount = (currentValue: { [key: string]: ICartInput }) => {
  let sum = 0;
  const total = currentValue
    ? Object.values(currentValue).map((item: ICartInput) => {
        return (sum =
          sum +
          Number(item.product_discounted_cost) * (item.quantity as number));
      })
    : [0];
  return total[total.length - 1];
};
