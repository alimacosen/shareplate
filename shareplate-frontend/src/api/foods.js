import api from "./axios";

export const getFoods = async (ids) => {
  // iterate through ids and get each food
  // return an array of foods
  const foods = [];
  for (let i = 0; i < ids.length; i++) {
    const food = await api.get(`/foods/${ids[i]}`);
    foods.push(food);
  }
  return foods;
};

export const postFood = async (data) => {
  return await api.post(`/foods`, data);
};

export const patchFood = async (id, data) => {
  return await api.patch(`/foods/${id}`, data);
};

export const deleteFood = async (id) => {
  return await api.delete(`/foods/${id}`);
};
