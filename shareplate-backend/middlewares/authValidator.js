import ValidatorBuilder from "./validatorBuilder.js";
import AuthHandler from "./handlers/authHandler.js";
import UserExistHandler from "./handlers/emailExistHandler.js";

class AuthValidator extends ValidatorBuilder {
    constructor() {
        super();
        this.add(new AuthHandler());
    }
}

export default AuthValidator;
