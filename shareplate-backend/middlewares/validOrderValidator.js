import ValidatorBuilder from "./validatorBuilder.js";
import AuthHandler from "./handlers/authHandler.js";
import ValidOrderHandler from "./handlers/validOrderHandler.js";

class ValidOrderValidator extends ValidatorBuilder {
    constructor(model) {
        super();
        this.model = model;
        this.add(new AuthHandler());
        this.add(new ValidOrderHandler(model));
    }
}

export default ValidOrderValidator;
