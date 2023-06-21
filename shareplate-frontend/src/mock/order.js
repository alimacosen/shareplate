import { burger, chicken, fries, salad } from "./food";

export const orders = [
  {
    _id: "642f8b709330e95142fc1a74",
    userId: "641cefdb40ca80fe3243e725",
    shopId: "641e9da45d7eeb246e76ea5b",
    createdTime: "2022-03-23T08:18:19.961Z",
    foods: [burger, fries, chicken, salad],
    status: 1,
    linkedReviews: {
      fromCustomer: null,
      fromShop: null,
    },
    price: 13.97,
    type: 0,
    boxNum: 1,
  },
];
