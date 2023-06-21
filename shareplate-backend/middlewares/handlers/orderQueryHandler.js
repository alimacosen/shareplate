import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";
import asyncHandler from "express-async-handler";

// This class is used to check if the type of the request is different from the type of the target
class OrderQueryHandler extends BaseHandler {
    constructor(model) {
        super();
    }

    QUERY_KEYS = {
        USER_ID: "userId",
        SHOP_ID: "shopId",
    };

    verifyOrderQuery = (req, res) => {
        const queryKeys = Object.keys(req.query);
        let queryVal = null;
        let queryKey = null;
        if (queryKeys.includes(this.QUERY_KEYS.USER_ID) && queryKeys.includes(this.QUERY_KEYS.SHOP_ID)) {
            throw new CustomError(EnumError.BAD_REQUEST, "Cannot query by both userId and shopId");
        } else if (queryKeys.includes(this.QUERY_KEYS.USER_ID)) {
            queryKey = this.QUERY_KEYS.USER_ID;
            queryVal = req.query.userId;
        } else if (queryKeys.includes(this.QUERY_KEYS.SHOP_ID)) {
            queryKey = this.QUERY_KEYS.SHOP_ID;
            queryVal = req.query.shopId;
        } else {
            throw new CustomError(EnumError.BAD_REQUEST, "Query must contain either userId or shopId");
        }
        if (queryVal != req.id) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
        let query = {};
        query[queryKey] = queryVal;
        req.query = query;
    };

    handle = asyncHandler(async (req, res, next) => {
        this.verifyOrderQuery(req, res);
        super.handle(req, res, next);
    });
}

export default OrderQueryHandler;
