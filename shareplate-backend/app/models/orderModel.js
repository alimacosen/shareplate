import { EnumError, EnumType, EnumOrderStatus } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";

class OrderModel {
    constructor(orderDBs, mode) {
        this.orderDBs = orderDBs;
        this.setMode(mode);
    }

    setMode = (mode) => {
        this.mode = mode;
        this.orderModel = this.orderDBs[this.mode];
    };

    getOrders = async (filter) => {
        var orders = await this.orderModel.find(filter).catch((err) => {
            throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
        });
        return orders;
    };

    creatOrder = async (order) => {
        var order = await this.orderModel(order)
            .save()
            .catch((err) => {
                throw new CustomError(EnumError.INTERNAL_SERVER_ERROR, err);
            });
        return order._id;
    };

    updateOrder = async (filter, updates) => {
        const options = { new: true };
        var order = await this.orderModel
            .findOneAndUpdate(filter, { $set: updates }, options)
            .populate({
                path: "shopId",
                select: "name",
                model: "shops",
            })
            .catch((err) => {
                throw new CustomError(EnumError.INTERNAL_SERVER_ERROR, err);
            });
        return order;
    };
}

export default OrderModel;
