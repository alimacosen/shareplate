import { EnumOrderStatus, EnumOrderType, EnumError } from "../../../../constants/enum.js";
import Food from "../../foodHandler/food.js";

class BasicOrder {
    constructor() {
        this.userId = null;
        this.shopId = null;
        this.createdTime = Date.now();
        this.foods = [];
        this.items = [];
        this.status = EnumOrderStatus.PENDING;
        this.linkedReviews = {};
        this.price = -1;
        this.type = null;
    }

    parseMetaInfo = (metaInfo) => {
        this.userId = metaInfo.body.userId;
        this.shopId = metaInfo.body.shopId;
        this.items = metaInfo.body.items;
        this.linkedReviews = metaInfo.body.linkedReviews;
        this.type = metaInfo.body.type;
    };

    getPrice = () => {
        if (this.price >= 0) {
            return this.price;
        }
        let total = 0;
        for (let i = 0; i < this.foods.length; i++) {
            let unitPrice = this.foods[i].price;
            total += unitPrice * this.foods[i].quantity;
        }
        this.price = total;
        return this.price;
    };

    getItems = async (foodModel) => {
        for (let i = 0; i < this.items.length; i++) {
            const foodId = this.items[i].foodId;
            const quantity = this.items[i].quantity;
            const foodDataList = await foodModel.getFood({ _id: foodId });
            if (foodDataList.length == 0) {
                throw new Error(EnumError.FOOD_NOT_FOUND);
            }
            const foodData = foodDataList[0];
            let foodInfo = new Food(foodData.foodName, foodData.price, quantity, foodData.description, foodData.image);
            this.foods.push(foodInfo);
        }
    };

    toJSON() {
        const { userId, shopId, createdTime, items, status, linkedReviews, price, type } = this;
        return { userId, shopId, createdTime, items, status, linkedReviews, price, type };
    }
}

export default BasicOrder;
