class OrderStatusObserver {
    constructor(io) {
        this.io = io;
    }

    update = (order) => {
        const customerId = order.userId;
        this.io.to(customerId.toString()).emit("orderStatusChanged", { order });
    };
}

export default OrderStatusObserver;
