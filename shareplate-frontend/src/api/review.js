import api from "./axios";
import { USER_TYPE } from "../enum";

export const postReview = async (userType, revieweeId, payload) => {
  let reviewSubject = "";
  switch (userType) {
    case USER_TYPE.CUSTOMER:
      reviewSubject = "shops";
      break;
    case USER_TYPE.SHOP:
      reviewSubject = "customers";
      break;
  }
  return await api.post(`/${reviewSubject}/${revieweeId}/reviews`, payload);
};
