import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";

// This is the interface for all handlers
class HandlerInterface {
    setNext(handler) {
        throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
    }
    handle(req, res, next) {
        throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
    }
}

export default HandlerInterface;
