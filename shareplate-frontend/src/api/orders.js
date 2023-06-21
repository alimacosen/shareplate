import { ORDER_STATUS } from "../enum";
import api from "./axios";

export const getOrder = async (id) => {
  return await api.get(`/orders/${id}`);
};

export const placeOrder = async (order) => {
  return await api.post("/orders", order);
};

export const confirmOrder = async (id) => {
  return await api.patch(`/orders/${id}`, {
    nextStatus: ORDER_STATUS.CONFIRMED,
  });
};

export const cancelOrder = async (id) => {
  return await api.patch(`/orders/${id}`, {
    nextStatus: ORDER_STATUS.CANCELED,
  });
};

export const completeOrder = async (id) => {
  return await api.patch(`/orders/${id}`, {
    nextStatus: ORDER_STATUS.COMPLETED,
  });
};
