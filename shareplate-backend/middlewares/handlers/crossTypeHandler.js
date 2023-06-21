import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";
import asyncHandler from "express-async-handler";

// This class is used to check if the type of the request is different from the type of the target
class CrossTypeHandler extends BaseHandler {
    constructor(model) {
        super();
        this.model = model;
    }

    verifyCrossType = asyncHandler(async (req, res) => {
        const targetId = req.params.id;
        const myType = req.type;
        const target = await this.model.getById(targetId);
        const targetType = target.type;
        if (myType === targetType) {
            throw new CustomError(EnumError.PERMISSION_DENIED, "Can only refer to a review from different type");
        }
    });

    handle = asyncHandler(async (req, res, next) => {
        // await is necessary here, please not remove it
        await this.verifyCrossType(req, res);
        super.handle(req, res, next);
    });
}

export default CrossTypeHandler;
