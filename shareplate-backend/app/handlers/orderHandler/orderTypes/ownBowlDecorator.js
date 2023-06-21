import BaseDecorator from "./baseDecorator.js";
import { EnumError, EnumType, EnumOrderType } from "../../../../constants/enum.js";
import mapper from "./utils.js";

const DISCOUNT = {
    DEFAULT: 0.9,
};

class OwnBowlDecorator extends BaseDecorator {
    constructor(order) {
        super(order);
        this.type = EnumOrderType.OWN_BOWL;
        this.price = -1;
        this.getPrice();
    }

    getPrice = () => {
        if (this.price == -1) {
            let price = this.basicOrder.getPrice();
            this.price = price * DISCOUNT.DEFAULT;
        }
        return this.price;
    };

    toJSON() {
        const { userId, shopId, createdTime, items, status, linkedReviews, type } = mapper(this.basicOrder);
        const price = this.price;
        return { userId, shopId, createdTime, items, status, linkedReviews, price, type };
    }
}

export default OwnBowlDecorator;
