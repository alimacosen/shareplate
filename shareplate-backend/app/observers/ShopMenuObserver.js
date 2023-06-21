class ShopMenuObserver {
    constructor(io) {
        this.io = io;
    }

    update(subscribers, data) {
        for (let i = 0; i < subscribers.length; i++) {
            const subscriberId = subscribers[i];
            this.io.to(subscriberId.toString()).emit("menuChanged", { data });
        }
    }
}

export default ShopMenuObserver;
