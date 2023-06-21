import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";
import asyncHandler from "express-async-handler";

// This class is used to check if the id in the request exists in the database
class IdExistHandler extends BaseHandler {
    constructor(model) {
        super();
        this.model = model;
    }

    checkIdExists = asyncHandler(async (req, res) => {
        const paramId = req.params.id;
        const selfId = req.id;
        if (paramId) {
            const entity = await this.model.getById(paramId);
            if (!entity) {
                throw new CustomError(EnumError.USER_NOT_FOUND, "Cannot find user by id");
            }
        }
        if (selfId) {
            const entity = await model.getById(selfId);
            if (!entity) {
                throw new CustomError(EnumError.USER_NOT_FOUND, "Cannot find user by id");
            }
        }
    });

    handle = (req, res, next) => {
        this.checkIdExists(req, res);
        super.handle(req, res, next);
    };
}

export default IdExistHandler;
