import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";
import asyncHandler from "express-async-handler";

class ValidOrderHandler extends BaseHandler {
    constructor(model) {
        super();
        this.model = model;
    }

    verifyOrderIsValid = asyncHandler(async (req, res) => {
        const orderId = req.params.id;
        const orderRawList = await this.model.getOrders({ _id: orderId });
        if (orderRawList.length == 0) {
            throw new CustomError(EnumError.ORDER_NOT_FOUND, "Order not found");
        }
        const orderRaw = orderRawList[0];
        if (orderRaw.userId != req.id && orderRaw.shopId != req.id) {
            throw new CustomError(EnumError.PERMISSION_DENIED, "You are not allowed to access this order");
        }
        req.orderRaw = orderRaw;
    });

    handle = asyncHandler(async (req, res, next) => {
        await this.verifyOrderIsValid(req, res);
        super.handle(req, res, next);
    });
}

export default ValidOrderHandler;
