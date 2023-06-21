import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import BaseHandler from "./baseHandler.js";

// This class is used to check if the id in the request id match the id in the param.
class MatchIdHandler extends BaseHandler {
    constructor() {
        super();
    }

    matchParamId = (req, res) => {
        if (!req.params.id || !req.id) {
            throw new CustomError(EnumError.BAD_REQUEST, "Id is required");
        }
        if (req.id !== req.params.id) {
            throw new CustomError(EnumError.PERMISSION_DENIED, "Id not match");
        }
    };

    handle = (req, res, next) => {
        this.matchParamId(req, res);
        super.handle(req, res, next);
    };
}

export default MatchIdHandler;
