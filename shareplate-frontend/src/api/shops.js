import api from "./axios";

export const shopRegister = async (email, password) => {
  return await api.post("/shops", {
    email,
    password,
  });
};

export const shopLogin = async (email, password) => {
  return await api.post("/shops/sessions", {
    email,
    password,
  });
};

export const getShopData = async (id) => {
  if (!id) return await api.get("/shops/me");
  return await api.get(`/shops/${id}`);
};

export const subscribeShop = async (id) => {
  return await api.post(`/shops/${id}/subscribers`);
};

export const unsubscribeShop = async (id) => {
  return await api.delete(`/shops/${id}/subscribers`);
};

export const patchShopData = async (id, data) => {
  return await api.patch(`/shops/${id}`, data);
};
