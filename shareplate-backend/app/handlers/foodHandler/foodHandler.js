import Food from "./food.js";
import { EnumError, EnumType } from "../../../constants/enum.js";
import CustomError from "../../../constants/errors.js";

class FoodHandler {
    constructor(metaInfo, foodModel) {
        this.metaInfo = metaInfo;
        this.foodModel = foodModel;
        this.food = null;
    }

    getAllFood = async () => {
        const foods = await this.foodModel.getFood({});
        return foods;
    };

    getFoodById = async () => {
        const id = this.metaInfo.params.id;
        const food = await this.foodModel.getFood({ _id: id });
        if (!food) {
            throw new CustomError(EnumError.FOOD_NOT_FOUND);
        }
        return food;
    };

    createNewFood = async () => {
        if (this.metaInfo.type != EnumType.SHOP) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
        this.food = new Food(
            this.metaInfo.body.foodName,
            this.metaInfo.body.price,
            this.metaInfo.body.quantity,
            this.metaInfo.body.description,
            this.metaInfo.body.image
        );
        const foodObj = JSON.parse(JSON.stringify(this.food));
        const foodId = await this.foodModel.create(foodObj);
        return foodId;
    };

    updateFoodById = async () => {
        if (this.metaInfo.type != EnumType.SHOP) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
        const id = this.metaInfo.params.id;
        const updates = this.metaInfo.body;

        const food = await this.foodModel.getFood({ _id: id });
        if (!food) {
            throw new CustomError(EnumError.FOOD_NOT_FOUND);
        }

        const foodId = await this.foodModel.updateById({ _id: id }, updates);
        return foodId;
    };

    deleteFoodById = async () => {
        if (this.metaInfo.type != EnumType.SHOP) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
        const id = this.metaInfo.params.id;

        const food = await this.foodModel.getFood({ _id: id });
        if (!food) {
            throw new CustomError(EnumError.FOOD_NOT_FOUND);
        }

        const foodId = await this.foodModel.deleteById({ _id: id });
        return foodId;
    };
}

export default FoodHandler;
