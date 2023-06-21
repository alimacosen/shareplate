import { EnumError } from "../../constants/enum.js";

class FoodModel {
    constructor(foodDBs, mode) {
        this.foodDBs = foodDBs;
        this.setMode(mode);
    }

    setMode = (mode) => {
        this.mode = mode;
        this.model = this.foodDBs[this.mode];
    };

    getFood = async (filter) => {
        var foods = await this.model.find(filter).catch((error) => {
            throw new Error(EnumError.INTERNAL_SERVER_ERROR);
        });
        return foods;
    };

    create = async (foodInfo) => {
        var food = await this.model(foodInfo)
            .save()
            .catch((error) => {
                throw new Error(EnumError.INTERNAL_SERVER_ERROR);
            });
        return food._id;
    };

    updateById = async (filter, updates) => {
        var food = await this.model.findOneAndUpdate(filter, updates).catch((error) => {
            throw new Error(EnumError.INTERNAL_SERVER_ERROR);
        });
        return food._id;
    };

    deleteById = async (filter) => {
        var food = await this.model.findOneAndDelete(filter).catch((error) => {
            throw new Error(EnumError.INTERNAL_SERVER_ERROR);
        });
        return food._id;
    };
}

export default FoodModel;
