import { Schema } from "mongoose";

const customerSchema = new Schema({
    email: { type: String, min: 3, required: true, unique: true },
    password: { type: String, required: true },
    name: {
        type: String,
    },
    reviews: [
        {
            id: { type: Schema.Types.ObjectId, required: true },
            reviewer: { type: Schema.Types.ObjectId, ref: "shops" },
            createdTime: { type: Date, default: Date.now, required: true },
            content: { type: String },
            rating: { type: Number, min: 0, max: 5, required: true },
        },
    ],
});

export default customerSchema;
