import useSWR from "swr";
import axios from "axios";
import { USER_TYPE } from "../enum";

export function fetcher(url, queryParams = "") {
  const token = localStorage.getItem("SHAREPLATE_TOKEN");
  if (token) {
    return axios
      .get(`${url}${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
  }
  return axios.get(url).then((res) => res.data);
}

export const useUser = (userType, user_id = "me") => {
  let url = "";
  switch (userType) {
    case USER_TYPE.CUSTOMER:
      url = `${import.meta.env.VITE_API_ENDPOINT}/customers/${user_id}`;
      break;
    case USER_TYPE.SHOP:
      url = `${import.meta.env.VITE_API_ENDPOINT}/shops/${user_id}`;
      break;
  }
  const { data, mutate, error, isLoading } = useSWR(url, fetcher);

  return {
    user: data,
    mutate: mutate,
    isLoading: isLoading,
    isError: error,
  };
};

export const useShops = (params = "") => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/shops${params}`;
  const { data, mutate, error, isLoading } = useSWR(url, fetcher);
  return {
    shopList: data,
    mutate,
    isLoading,
    isError: error,
  };
};

export const useShop = (shopId = "me") => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/shops/${shopId}`;
  const { data, mutate, error, isLoading } = useSWR(url, fetcher);
  return {
    shop: data,
    mutate,
    isLoading,
    isError: error,
  };
};

export const useOrders = (
  userType,
  userId = localStorage.getItem("SHAREPLATE_ID")
) => {
  let url = "";
  switch (userType) {
    case USER_TYPE.CUSTOMER:
      url = `${import.meta.env.VITE_API_ENDPOINT}/orders?userId=${userId}`;
      break;
    case USER_TYPE.SHOP:
      url = `${import.meta.env.VITE_API_ENDPOINT}/orders?shopId=${userId}`;
      break;
  }
  const { data, mutate, error, isLoading } = useSWR(url, fetcher);
  return {
    orders: data,
    mutate,
    isLoading,
    isError: error,
  };
};

// TODO: make sure this is using the correct shopId?
export const useFoods = (userId = localStorage.getItem("SHAREPLATE_ID")) => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/foods?shopId=${userId}`;
  const { data, mutate, error, isLoading } = useSWR(url, fetcher);
  return {
    foods: data,
    mutate,
    isLoading,
    isError: error,
  };
};

export const useOrder = (orderId) => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/orders/${orderId}`;
  const { data, mutate, error, isLoading } = useSWR(url, fetcher);
  return {
    order: data,
    mutate,
    isLoading,
    isError: error,
  };
};
