class Food {
    constructor(foodName, price, quantity, description, image) {
        this.foodName = foodName;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.image = image;
    }

    toJSON() {
        const { foodName, price, quantity, description, image } = this;
        return { foodName, price, quantity, description, image };
    }
}

export default Food;
