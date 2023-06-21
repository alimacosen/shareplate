import mongoose from "mongoose";
import { EnumOrderStatus, EnumOrderType } from "../constants/enum";

class Fake {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    static generateRandomEmail(length) {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let email = "";

        // Generate a random local part
        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * characters.length);
            email += characters[index];
        }

        // Append a random domain
        const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
        const domainIndex = Math.floor(Math.random() * domains.length);
        email += `@${domains[domainIndex]}`;

        return email;
    }

    static getRandomString(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static fakeHashedPassword = "thisIsEncryptedPassword";
    static fakeJWT = "thisIsFakeJWT";

    static getRandomReviews(length) {
        let reviews = [];
        for (let i = 0; i < length; i++) {
            reviews.push({
                id: new mongoose.Types.ObjectId(),
                reviewerId: new mongoose.Types.ObjectId(),
                createdTime: new Date(),
                content: this.getRandomString(this.getRandomInt(5, 10)),
                rating: this.getRandomInt(0, 5),
            });
        }
        return reviews;
    }

    static getFakeCustomer() {
        const fakeEmail = this.generateRandomEmail(this.getRandomInt(5, 10));
        return {
            _id: new mongoose.Types.ObjectId(),
            email: fakeEmail,
            name: fakeEmail,
            password: this.getRandomString(this.getRandomInt(5, 10)),
            passwordHash: this.fakeHashedPassword,
            subscribedShops: [new mongoose.Types.ObjectId(), , new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            reviews: this.getRandomReviews(this.getRandomInt(0, 5)),
            type: 0,
            toObject: function () {
                // Return a plain JavaScript object
                return {
                    _id: this._id,
                    email: this.email,
                    name: this.name,
                    password: this.password,
                    subscribedShops: this.subscribedShops,
                    reviews: this.reviews,
                    type: this.type,
                };
            },
        };
    }

    static getFakeShop() {
        const fakeEmail = this.generateRandomEmail(this.getRandomInt(5, 10));
        return {
            _id: new mongoose.Types.ObjectId(),
            email: fakeEmail,
            name: fakeEmail,
            password: this.getRandomString(this.getRandomInt(5, 10)),
            passwordHash: this.fakeHashedPassword,
            description: "fake shop for testing",
            location: {
                type: "Point",
                coordinates: [-39.99, 29.99],
            },
            shopType: ["fake"],
            followers: [new mongoose.Types.ObjectId(), , new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            menu: [new mongoose.Types.ObjectId(), , new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            availble: 0,
            reviews: this.getRandomReviews(this.getRandomInt(0, 5)),
            type: 1,
            toObject: function () {
                // Return a plain JavaScript object
                return {
                    _id: this._id,
                    email: this.email,
                    name: this.name,
                    description: this.description,
                    location: this.location,
                    shopType: this.shopType,
                    followers: this.followers,
                    menu: this.menu,
                    availble: this.availble,
                    reviews: this.reviews,
                    type: 1,
                };
            },
        };
    }

    static getFakeFood() {
        const ramdomFoodId = this.getRandomInt(1, 11);
        const ramdomFoodPrice = this.getRandomInt(3, 23);
        return {
            _id: new mongoose.Types.ObjectId(),
            foodName: "fakeFood" + ramdomFoodId,
            quantity: this.getRandomInt(1, 101),
            price: ramdomFoodPrice,
            description: "hey! It's a fake food " + ramdomFoodId,
            image: "https://fakefood.com/fakefoodid" + ramdomFoodId,
            __v: 0,
        };
    }

    static getFakeOrder(type) {
        let order = {
            _id: new mongoose.Types.ObjectId(),
            userId: Fake.getFakeCustomer()._id,
            shopId: Fake.getFakeShop()._id,
            createdTime: Date.now(),
            items: null,
            status: EnumOrderStatus.PENDING,
            linkedReviews: { fromCustomer: null, fromShop: null },
            price: -1,
            type: type,
        };
        switch (type) {
            case EnumOrderType.BASIC:
                break;
            case EnumOrderType.TOGO_BOX:
                order.boxNum = Fake.getRandomInt(1, 5);
                break;
            case EnumOrderType.CURBSIDE:
                order.pickupLocation = "This is fake pickup location";
                order.carInfo = {
                    brand: "Fake car brand",
                    color: "Fake car color",
                    plateNo: "Fake plate number",
                };
                break;
            default:
                throw new Error("invalid order type");
        }
        return order;
    }
}

export default Fake;
