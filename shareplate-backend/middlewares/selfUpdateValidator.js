import ValidatorBuilder from "./validatorBuilder.js";
import AuthHandler from "./handlers/authHandler.js";
import MatchIdHandler from "./handlers/matchIdHandler.js";

class SelfUpdateValidator extends ValidatorBuilder {
    constructor() {
        super();
        this.add(new AuthHandler());
        this.add(new MatchIdHandler());
    }
}

export default SelfUpdateValidator;
