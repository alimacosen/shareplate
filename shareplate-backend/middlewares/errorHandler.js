import CustomError from "../constants/errors.js";
import { EnumError } from "../constants/enum.js";

class ErrorHandler {
    // Invalid Reqest Handler Error handler
    static invalidReqestHandler = (req, res, next) => {
        const error = new CustomError(EnumError.PATH_NOT_FOUND);
        return next(error);
    };

    static generalErrorHandler = (err, req, res, next) => {
        console.log(err);
        console.log(err.ErrorStack[err.message]);
        const message = err.ErrorStack[err.message]?.message || err.ErrorStack[EnumError.INTERNAL_SERVER_ERROR].message;
        const status = err.ErrorStack[err.message]?.status || err.ErrorStack[EnumError.INTERNAL_SERVER_ERROR].status;
        res.status(status);
        res.json({
            error: status,
            stack: process.env.NODE_ENV === "production" ? null : message,
        });
    };
}

export default ErrorHandler;
