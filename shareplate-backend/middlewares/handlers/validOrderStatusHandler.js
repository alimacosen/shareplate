import { EnumError, EnumOrderStatus } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";
import asyncHandler from "express-async-handler";

class ValidOrderStatusHandler extends BaseHandler {
    constructor(model) {
        super();
        this.model = model;
    }

    verifyNextOrderStatus = asyncHandler(async (req, res) => {
        const nextStatus = req.body.nextStatus;
        if (req.type != 1 && nextStatus != EnumOrderStatus.CANCELED) {
            throw new CustomError(EnumError.UNAUTHENTICATED, "Only shop are allowed to change order status");
        }
        if (!Object.values(EnumOrderStatus).includes(nextStatus)) {
            throw new Error(EnumError.INVALID_STATUS);
        }
        const id = req.params.id;
        const orderRawList = await this.model.getOrders({ _id: id });
        const orderRaw = orderRawList[0];
        req.currentOrderStatus = orderRaw.status;
    });

    checkIfNextCancelStatus = (req, res) => {
        const nextStatus = req.body.nextStatus;
        const currentOrderStatus = req.currentOrderStatus;
        req.cancelOrder = false;
        if (
            nextStatus == EnumOrderStatus.CANCELED &&
            currentOrderStatus != EnumOrderStatus.COMPLETED &&
            currentOrderStatus != EnumOrderStatus.CANCELED
        ) {
            req.cancelOrder = true;
        }
    };

    checkIsValidNextStatus = (req, res) => {
        const nextStatus = req.body.nextStatus;
        const currentStatus = req.currentOrderStatus;
        if (req.cancelOrder) return;
        if (
            !(
                (currentStatus == EnumOrderStatus.PENDING && nextStatus == EnumOrderStatus.CONFIRMED) ||
                (currentStatus == EnumOrderStatus.CONFIRMED && nextStatus == EnumOrderStatus.COMPLETED)
            )
        ) {
            throw new CustomError(EnumError.INVALID_STATUS, "Invalid next status");
        }
    };

    handle = asyncHandler(async (req, res, next) => {
        await this.verifyNextOrderStatus(req, res);
        this.checkIfNextCancelStatus(req, res);
        this.checkIsValidNextStatus(req, res);
        super.handle(req, res, next);
    });
}

export default ValidOrderStatusHandler;
