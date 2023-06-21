import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";

// This class is used to check if the email and password exists in the request.
class ProfileDataHandler extends BaseHandler {
    constructor() {
        super();
    }

    validate = (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        if (!email) {
            throw new CustomError(EnumError.BAD_REQUEST, "Email is required");
        }
        if (!password) {
            throw new CustomError(EnumError.BAD_REQUEST, "Password is required");
        }
    };

    handle = (req, res, next) => {
        this.validate(req, res);
        super.handle(req, res, next);
    };
}

export default ProfileDataHandler;
