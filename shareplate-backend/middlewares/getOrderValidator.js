import ValidatorBuilder from "./validatorBuilder.js";
import AuthHandler from "./handlers/authHandler.js";
import OrderQueryHandler from "./handlers/orderQueryHandler.js";

class GetOrderValidator extends ValidatorBuilder {
    constructor() {
        super();
        this.add(new AuthHandler());
        this.add(new OrderQueryHandler());
    }
}

export default GetOrderValidator;
