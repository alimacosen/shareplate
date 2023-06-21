import api from "./axios";

export const customerRegister = async (email, password) => {
  return await api.post("/customers", {
    email,
    password,
  });
};

export const customerLogin = async (email, password) => {
  return await api.post("/customers/sessions", {
    email,
    password,
  });
};

export const getCustomerData = async (id) => {
  if (!id) return await api.get("/customers/me");
  return await api.get(`/customers/${id}`);
};

export const patchCustomerData = async (id, data) => {
  return await api.patch(`/customers/${id}`, data);
};
