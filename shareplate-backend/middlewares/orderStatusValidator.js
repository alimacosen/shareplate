import ValidatorBuilder from "./validatorBuilder.js";
import AuthHandler from "./handlers/authHandler.js";
import ValidOrderStatusHandler from "./handlers/validOrderStatusHandler.js";

class OrderStatusValidator extends ValidatorBuilder {
    constructor(model) {
        super();
        this.model = model;
        this.add(new AuthHandler());
        this.add(new ValidOrderStatusHandler(model));
    }
}

export default OrderStatusValidator;
