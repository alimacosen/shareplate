import { EnumError } from "./enum.js";
class CustomError extends Error {
    ErrorStack = {
        [EnumError.USER_NOT_FOUND]: {
            message: "User not found",
            status: 400,
        },
        [EnumError.USER_EXISTS]: {
            message: "Email has already existed.",
            status: 400,
        },
        [EnumError.BAD_REQUEST]: {
            message: "Bad Request.",
            status: 400,
        },
        [EnumError.UNAUTHENTICATED]: {
            message: "Unauthenticated access",
            status: 401,
        },
        [EnumError.PATH_NOT_FOUND]: {
            message: "Path not found",
            status: 404,
        },
        [EnumError.INTERNAL_SERVER_ERROR]: {
            message: "Internal Server Error",
            status: 500,
        },
        [EnumError.SERVICE_UNAVAILABLE]: {
            message: "Server down for maintenance",
            status: 503,
        },
        [EnumError.PERMISSION_DENIED]: {
            message: "Permission deny",
            status: 403,
        },
        [EnumError.FOOD_NOT_FOUND]: {
            message: "Food Not found.",
            status: 404,
        },
        [EnumError.ORDER_NOT_FOUND]: {
            message: "Food Not found.",
            status: 404,
        },
        [EnumError.OUT_OF_STOCK]: {
            message: "Food Out of Stock.",
            status: 400,
        },
        [EnumError.UNIMLEMENTED]: {
            message: "Food Not found.",
            status: 500,
        },
        [EnumError.NEGATIVE_PRICE]: {
            message: "Food Not found.",
            status: 500,
        },
        [EnumError.INVALID_STATUS]: {
            message: "Food Not found.",
            status: 400,
        },
    };

    constructor(errorType, message = null) {
        super(errorType);
        this.errorType = errorType;
        this.status = this.ErrorStack[errorType].status;
        if (message) {
            this.ErrorStack[errorType].message = message;
        }
        return this;
    }
}

export default CustomError;
