import { Schema } from "mongoose";

const foodSchema = new Schema({
    image: {
        type: String,
        default: null,
    },
    foodName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
        required: true,
    },
    description: {
        type: String,
    },
});

export default foodSchema;
