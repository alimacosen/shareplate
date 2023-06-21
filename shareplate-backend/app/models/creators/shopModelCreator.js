import ShopModel from "../shopModel.js";
import ModelCreator from "./modelCreator.js";

class ShopModelCreator extends ModelCreator {
    constructor(shopDBs, mode) {
        super();
        this.mode = mode;
        this.shopDBs = shopDBs;
    }
    createModel = () => {
        return new ShopModel(this.shopDBs, this.mode);
    };
}

export default ShopModelCreator;
