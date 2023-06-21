import { Schema } from "mongoose";
import { EnumOrderStatus, EnumOrderType } from "../../../constants/enum.js";

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    shopId: {
        type: Schema.Types.ObjectId,
        ref: "shops",
        required: true,
    },

    createdTime: {
        type: Date,
        default: Date.now,
    },

    items: [
        {
            foodId: { type: Schema.Types.ObjectId, ref: "foods" },
            quantity: Number,
        },
    ],

    status: {
        type: Number,
        enum: [
            EnumOrderStatus.PENDING,
            EnumOrderStatus.CONFIRMED,
            EnumOrderStatus.COMPLETED, // notify
            EnumOrderStatus.CANCELED, // notify
        ],
        default: EnumOrderStatus.PENDING,
    },

    linkedReviews: {
        fromCustomer: { type: Schema.Types.ObjectId, default: null },
        fromShop: { type: Schema.Types.ObjectId, default: null },
    },

    price: {
        type: Number,
        default: 0,
    },

    type: {
        type: Number,
        enum: [EnumOrderType.BASIC, EnumOrderType.TOGO_BOX, EnumOrderType.OWN_BOWL, EnumOrderType.CURBSIDE],
        default: EnumOrderType.BASIC,
    },

    boxNum: {
        type: Number,
    },

    pickupLocation: {
        type: String,
    },

    carInfo: {
        brand: { type: String },
        color: { type: String },
        plateNo: { type: String },
    },
});

export default orderSchema;
