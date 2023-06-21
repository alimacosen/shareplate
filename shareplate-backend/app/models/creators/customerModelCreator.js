import ModelCreator from "./modelCreator.js";
import CustomerModel from "../customerModel.js";

class CustomerModelCreator extends ModelCreator {
    constructor(customerDBs, mode) {
        super();
        this.mode = mode;
        this.customerDBs = customerDBs;
    }
    createModel = () => {
        return new CustomerModel(this.customerDBs, this.mode);
    };
}

export default CustomerModelCreator;
