import { EnumError, EnumType } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import AbstractModel from "./AbstractModel.js";
import { Types } from "mongoose";
const { ObjectId } = Types;
class ShopModel extends AbstractModel {
    constructor(shopDBs, mode) {
        super(shopDBs, mode);
    }

    signup = async (email, password) => {
        var shop = await this.model({
            email: email,
            password: password,
            name: email,
            description: "",
            location: { type: "Point", coordinates: [0, 0] },
            shopType: [],
            followers: [],
            menu: [],
            available: false,
            reviews: [],
            rating: 0,
        })
            .save()
            .catch((error) => {
                if (error.name == "MongoServerError" && error.code == 11000) {
                    throw new CustomError(EnumError.USER_EXISTS);
                } else {
                    throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
                }
            });
        return shop._id;
    };

    getById = async (id, toObj = true) => {
        var target = await this.model
            .findOne({ _id: id })
            .populate({
                path: "reviews.reviewer",
                select: "name",
                model: "customers",
            })
            .populate({
                path: "menu",
                model: "foods",
            })
            .catch((error) => {
                throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
            });
        if (!target) {
            throw new CustomError(EnumError.USER_NOT_FOUND);
        }
        if (toObj) {
            target = target.toObject();
            target.type = EnumType.SHOP;
        }
        return target;
    };

    createReview = async (reviewer, revieweeId, createdTime, content, rating, order) => {
        const reviewId = new ObjectId();
        var shop = await this.model.findOneAndUpdate(
            { _id: revieweeId },
            {
                $push: { reviews: { _id: reviewId, reviewer, createdTime, content, rating } },
            }
        );
        var overall_rating = (await (shop.rating * (shop.reviews.length - 1) + rating)) / shop.reviews.length;
        await this.model.findOneAndUpdate({ _id: revieweeId }, { rating: overall_rating.toFixed(2) });
        return reviewId;
    };

    updateShop = async (id, update) => {
        var shop = await this.model.findOneAndUpdate({ _id: id }, update, { new: true });
        return shop;
    };

    searchByCategory = async (category) => {
        var shop = await this.model.find({ shopType: category });
        return shop;
    };

    searchByAvailability = async (availibility) => {
        var shop = await this.model.find({ available: availibility });
        return shop;
    };

    searchByRating = async (rating) => {
        var shop = await this.model.find({ rating: { $gte: rating } });
        return shop;
    };

    searchByName = async (name) => {
        var shop = await this.model.find({ name: name });
        return shop;
    };

    searchByLocation = async (location) => {
        var shop = await this.model.find();
        return shop;
    };

    subscribeShop = async (shopId, customerId) => {
        const filter = { _id: shopId };
        const update = { $push: { subscribers: customerId } };
        var shop = await this.model.findOneAndUpdate(filter, update);
        return shop;
    };

    removeSubscriber = async (shopId, customerId) => {
        const filter = { _id: shopId };
        const update = { $pull: { subscribers: customerId } };
        await this.model.findOneAndUpdate(filter, update);
    };
}

export default ShopModel;
