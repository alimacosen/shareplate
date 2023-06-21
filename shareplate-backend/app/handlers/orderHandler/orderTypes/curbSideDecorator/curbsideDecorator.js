import BaseDecorator from "../baseDecorator.js";
import { EnumError, EnumType, EnumOrderType } from "../../../../../constants/enum.js";
import mapper from "../utils.js";
import Car from "./car.js";

const Threashould = {
    // class level: [ceiling money amount, service fee charged]
    CLASS_ONE: [0, 5.99],
    CLASS_TWO: [15, 2.99],
    CLASS_FREE: [30, 0],
};

class CurbsideDecorator extends BaseDecorator {
    constructor(order) {
        super(order);
        this.type = EnumOrderType.CURBSIDE;
        this.price = -1;
        this.pickupLocation = null;
        this.carInfo = null;
    }

    getPrice = () => {
        if (this.price == -1) {
            let price = this.basicOrder.getPrice();
            if (price >= Threashould.CLASS_FREE[0]) {
                price += Threashould.CLASS_FREE[1];
            } else if (price >= Threashould.CLASS_TWO[0]) {
                price += Threashould.CLASS_TWO[1];
            } else if (price >= Threashould.CLASS_ONE[0]) {
                price += Threashould.CLASS_ONE[1];
            } else {
                throw new Error(EnumError.UNIMLEMENTED);
            }
            this.price = price;
        }
        return this.price;
    };

    setCarInfo = (car) => {
        this.carInfo = new Car(car.brand, car.color, car.plateNo);
        return this;
    };

    setPickUPSpot = (spot) => {
        this.pickupLocation = spot;
        return this;
    };

    toJSON() {
        const { userId, shopId, createdTime, items, status, linkedReviews, type } = mapper(this.basicOrder);
        const price = this.price;
        const pickupLocation = this.pickupLocation;
        const carInfo = this.carInfo;
        return { userId, shopId, createdTime, items, status, linkedReviews, price, type, pickupLocation, carInfo };
    }
}

export default CurbsideDecorator;
