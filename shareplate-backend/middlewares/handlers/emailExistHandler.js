import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";
import asyncHandler from "express-async-handler";
// This class is used to check if the email in the request exists in the database
class EmailExistHandler extends BaseHandler {
    constructor(model) {
        this.model = model;
        super();
    }

    checkEmailExists = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const entity = await model.getByEmail(email);
        if (!entity) {
            throw new CustomError(EnumError.USER_NOT_FOUND, "Cannot find user by email");
        }
    });

    handle = (req, res, next) => {
        this.checkEmailExists(req, res);
        super.handle(req, res, next);
    };
}

export default EmailExistHandler;
