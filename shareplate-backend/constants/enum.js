const EnumDB = {
    production: 0,
    mock: 1,
};

const EnumError = {
    USER_NOT_FOUND: 1,
    USER_EXISTS: 2,
    BAD_REQUEST: 3,
    UNAUTHENTICATED: 4,
    PATH_NOT_FOUND: 5,
    SERVICE_UNAVAILABLE: 6,
    PERMISSION_DENIED: 7,
    INTERNAL_SERVER_ERROR: 8,
    FOOD_NOT_FOUND: 9,
    ORDER_NOT_FOUND: 10,
    OUT_OF_STOCK: 11,
    UNIMLEMENTED: 12,
    NEGATIVE_PRICE: 13,
    INVALID_STATUS: 14,
};

const EnumType = {
    CUSTOMER: 0,
    SHOP: 1,
};

const EnumOrderStatus = {
    PENDING: 0,
    CONFIRMED: 1,
    COMPLETED: 2,
    CANCELED: 3,
};

const EnumOrderType = {
    BASIC: 0,
    TOGO_BOX: 1,
    OWN_BOWL: 2,
    CURBSIDE: 3,
};

const EnumInventoryOps = {
    SUBTRACTION: -1,
    ADDITION: 1,
};

const EnumModelType = {
    CUSTOMER: 0,
    SHOP: 1,
    FOOD: 2,
    ORDER: 3,
};

export { EnumDB, EnumError, EnumType, EnumOrderStatus, EnumOrderType, EnumInventoryOps, EnumModelType };
