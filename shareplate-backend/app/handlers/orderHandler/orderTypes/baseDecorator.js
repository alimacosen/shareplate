import Order from "./basicOrder.js";
import { EnumError, EnumType, EnumOrderType } from "../../../../constants/enum.js";

class BaseDecorator {
    constructor(order) {
        this.basicOrder = order;
        this.type = null;
    }

    getPrice = () => {
        throw new Error(EnumError.UNIMLEMENTED);
    };
}

export default BaseDecorator;
