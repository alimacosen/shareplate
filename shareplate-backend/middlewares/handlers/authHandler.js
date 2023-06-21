import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import jwt from "jsonwebtoken";
import BaseHandler from "./baseHandler.js";

// This class is used to check if the requestor is authenticated
class AuthHandler extends BaseHandler {
    constructor() {
        super();
    }

    verifyAuth = (req, res) => {
        if (!req.header("Authorization")) {
            throw new CustomError(EnumError.PERMISSION_DENIED);
        }
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.id = data.id;
            req.type = data.type;
        } catch (err) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
    };

    handle = (req, res, next) => {
        this.verifyAuth(req, res);
        super.handle(req, res, next);
    };
}

export default AuthHandler;
