import { EnumType } from "../../constants/enum.js";
const createReview = async (model, reviewerId, revieweeId, createdTime, content, rating) => {
    const reviewee = await model.createReview(reviewerId, revieweeId, createdTime, content, rating);
    return reviewee;
};

const updateOrderReviewer = async (model, type, reviewId, orderId) => {
    let updates = null;
    if (type === EnumType.CUSTOMER) {
        updates = { "linkedReviews.fromCustomer": reviewId };
    } else if (type === EnumType.SHOP) {
        updates = { "linkedReviews.fromShop": reviewId };
    }
    const order = await model.updateOrder({ _id: orderId }, updates);
    return order;
};

export { createReview, updateOrderReviewer };
