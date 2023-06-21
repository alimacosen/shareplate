import { EnumModelType } from "../../constants/enum.js";
import { initializeDbs } from "./db.js";
import ModelCreator from "./creators/modelCreator.js";
import CustomerModelCreator from "./creators/customerModelCreator.js";
import ShopModelCreator from "./creators/shopModelCreator.js";
import FoodModelCreator from "./creators/foodModelCreator.js";
import OrderModelCreator from "./creators/orderModelCreator.js";

class ModelInitializer {
    constructor(mode) {
        const { customerDBs, foodDBs, orderDBs, shopDBs } = initializeDbs();
        this.customerDBs = customerDBs;
        this.foodDBs = foodDBs;
        this.orderDBs = orderDBs;
        this.shopDBs = shopDBs;
        this.mode = mode;
        this.modelCreator = new ModelCreator();
    }

    initializeModel = (modelType) => {
        // Get specific model creator based on the model type
        if (modelType == EnumModelType.CUSTOMER) {
            this.modelCreator = new CustomerModelCreator(this.customerDBs, this.mode);
        } else if (modelType == EnumModelType.SHOP) {
            this.modelCreator = new ShopModelCreator(this.shopDBs, this.mode);
        } else if (modelType == EnumModelType.FOOD) {
            this.modelCreator = new FoodModelCreator(this.foodDBs, this.mode);
        } else if (modelType == EnumModelType.ORDER) {
            this.modelCreator = new OrderModelCreator(this.orderDBs, this.mode);
        }

        // Create and return the model
        return this.modelCreator.createModel();
    };
}

export default ModelInitializer;
