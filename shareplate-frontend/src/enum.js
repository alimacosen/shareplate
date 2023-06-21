export const USER_TYPE = {
  CUSTOMER: 0,
  SHOP: 1,
};

export const invertUserType = (userType) => {
  return userType === USER_TYPE.CUSTOMER ? USER_TYPE.SHOP : USER_TYPE.CUSTOMER;
};

export const ORDER_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  COMPLETED: 2,
  CANCELED: 3,
};

export const ORDER_TYPE = {
  BASIC: 0,
  TOGOBOX: 1,
  BYOB: 2,
  CURBSIDE: 3,
};

export const BOX_PRICE = 0.5;
