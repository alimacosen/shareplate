const mapper = (basicOrder) => {
    const userId = basicOrder.userId;
    const shopId = basicOrder.shopId;
    const createdTime = basicOrder.createdTime;
    const items = basicOrder.items;
    const status = basicOrder.status;
    const linkedReviews = basicOrder.linkedReviews;
    const type = basicOrder.type;
    return { userId, shopId, createdTime, items, status, linkedReviews, type };
};

export default mapper;
