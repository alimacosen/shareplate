export const USER_TYPE_MAP = {
  0: "Customer",
  1: "Shop",
};

export const SHOP_TYPE_MAP = {
  fastFood: "Fast Food",
  asian: "Asian",
  western: "Western",
  indian: "Indian",
  mexican: "Mexican",
  cafe: "Cafe",
  restaurant: "Restaurant",
  bakery: "Bakery",
  dessert: "Dessert",
  meal: "Meal",
  drink: "Drink",
  school: "School",
  ngo: "NGO",
  other: "Other",
};

export const SHOP_TYPE_LIST = Object.keys(SHOP_TYPE_MAP);

export const ORDER_STATUS_MAP = {
  0: "Pending",
  1: "Confirmed",
  2: "Completed",
  3: "Canceled",
};

export const ORDER_TYPE_MAP = {
  0: "Basic",
  1: "Togo Box",
  2: "Bring Your Own Bowl",
  3: "Curbside Pickup",
};
