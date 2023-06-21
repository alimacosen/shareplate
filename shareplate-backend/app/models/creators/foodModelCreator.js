import FoodModel from "../foodModel.js";
import ModelCreator from "./modelCreator.js";

class FoodModelCreator extends ModelCreator {
    constructor(foodDBs, mode) {
        super();
        this.mode = mode;
        this.foodDBs = foodDBs;
    }
    createModel = () => {
        return new FoodModel(this.foodDBs, this.mode);
    };
}

export default FoodModelCreator;
