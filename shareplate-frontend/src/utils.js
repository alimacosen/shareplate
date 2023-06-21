import { BOX_PRICE, ORDER_TYPE } from "./enum";

export function calcAvgRating(reviews) {
  if (reviews.length === 0) {
    return "N/A";
  }
  let sum = 0;
  for (let i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
  return (sum / reviews.length).toFixed(1);
}

export function calcOrderQuantity(order) {
  const foods = order.foods || order.items;
  let quantity = 0;
  for (let i = 0; i < foods.length; i++) {
    quantity += foods[i].quantity;
  }
  return quantity;
}

export function getCurrentOrderPrice(order, foods, orderType = -1, boxNum = 0) {
  let total = 0;
  for (const foodId in order) {
    const food = foods.find((food) => food._id === foodId);
    total += food.price * order[foodId];
  }
  if (orderType == ORDER_TYPE.TOGOBOX) {
    total += boxNum * BOX_PRICE;
  }
  return total.toFixed(2);
}

export function getAccountTypeByToken(token) {
  // decode token payload and check type
  if (!token) return null;
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  const accountType = JSON.parse(decodedPayload).type;
  return accountType;
}

export function generateGoogleMapDirectionLink(lat1, lng1, lat2, lng2) {
  return `https://www.google.com/maps/dir/${lat1},${lng1}/${lat2},${lng2}`;
}

export function requestPosition() {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
  };
  // eslint-disable-next-line no-undef
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(pos);
      },
      (err) => {
        reject(err);
      },
      options
    );
  });
}
