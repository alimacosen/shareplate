import { Schema } from "mongoose";

const shopSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    image: {
        type: String,
        default: null,
    },
    password: { type: String, required: true },
    description: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        },
    },
    shopType: [
        {
            type: String,
        },
    ],
    subscribers: [{ type: Schema.Types.ObjectId, ref: "customers" }],
    menu: [{ type: Schema.Types.ObjectId, ref: "foods" }],
    available: {
        type: Boolean,
        default: false,
        required: true,
    },
    reviews: [
        {
            id: { type: Schema.Types.ObjectId, required: true },
            reviewer: { type: Schema.Types.ObjectId, ref: "customers" },
            createdTime: { type: Date, default: Date.now, required: true },
            content: { type: String },
            rating: { type: Number, min: 0, max: 5, required: true },
        },
    ],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
});

export default shopSchema;
