import OrderModel from "../orderModel.js";
import ModelCreator from "./modelCreator.js";

class OrderModelCreator extends ModelCreator {
    constructor(orderDBs, mode) {
        super();
        this.mode = mode;
        this.orderDBs = orderDBs;
    }
    createModel = () => {
        return new OrderModel(this.orderDBs, this.mode);
    };
}

export default OrderModelCreator;
