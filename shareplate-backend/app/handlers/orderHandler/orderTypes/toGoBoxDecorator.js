import BaseDecorator from "./baseDecorator.js";
import { EnumError, EnumType, EnumOrderType } from "../../../../constants/enum.js";
import mapper from "./utils.js";

const BOX_PRICE = {
    DEFAULT: 0.5,
};

class ToGoBoxDecorator extends BaseDecorator {
    constructor(order) {
        super(order);
        this.type = EnumOrderType.TOGO_BOX;
        this.price = -1;
        this.boxNum = 0;
    }

    getPrice = () => {
        if (this.price == -1) {
            let price = this.basicOrder.getPrice();
            this.price = price + this.boxNum * BOX_PRICE.DEFAULT;
        }
        return this.price;
    };

    setBoxNum = (boxNum) => {
        this.boxNum = boxNum;
        return this;
    };

    toJSON() {
        const { userId, shopId, createdTime, items, status, linkedReviews, type } = mapper(this.basicOrder);
        const price = this.price;
        const boxNum = this.boxNum;
        return { userId, shopId, createdTime, items, status, linkedReviews, price, type, boxNum };
    }
}

export default ToGoBoxDecorator;
