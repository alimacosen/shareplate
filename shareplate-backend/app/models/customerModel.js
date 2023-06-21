import { EnumError, EnumType } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
import AbstractModel from "./AbstractModel.js";
import { Types } from "mongoose";
const { ObjectId } = Types;
class CustomerModel extends AbstractModel {
    constructor(customerDBs, mode) {
        super(customerDBs, mode);
    }
    signup = async (email, password) => {
        var user = await this.model({
            email: email,
            password: password,
            name: email,
            subscriptShops: [],
            reviews: [],
        })
            .save()
            .catch((error) => {
                if (error.name == "MongoServerError" && error.code == 11000) {
                    throw new CustomError(EnumError.USER_EXISTS);
                } else {
                    throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
                }
            });
        return user._id;
    };

    getById = async (id, toObj = true) => {
        var target = await this.model
            .findOne({ _id: id })
            .populate({
                path: "reviews.reviewer",
                select: "name",
                model: "shops",
            })
            .catch((error) => {
                throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
            });
        if (!target) {
            throw new CustomError(EnumError.USER_NOT_FOUND);
        }
        if (toObj) {
            target = target.toObject();
            target.type = EnumType.CUSTOMER;
        }
        return target;
    };

    updateById = async (id, update) => {
        var customer = await this.model.findOneAndUpdate({ _id: id }, update);
        return customer;
    };

    createReview = async (reviewer, revieweeId, createdTime, content, rating, order) => {
        const reviewId = new ObjectId();
        var customer = await this.model
            .findOneAndUpdate({ _id: revieweeId }, { $push: { reviews: { _id: reviewId, reviewer, createdTime, content, rating } } })
            .catch((error) => {
                throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
            });
        return reviewId;
    };
}

export default CustomerModel;
