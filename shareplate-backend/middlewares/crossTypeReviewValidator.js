import ValidatorBuilder from "./validatorBuilder.js";
import AuthHandler from "./handlers/authHandler.js";
import CrossTypeHandler from "./handlers/crossTypeHandler.js";

class CrossTypeReviewValidator extends ValidatorBuilder {
    constructor(model) {
        super();
        this.model = model;
        this.add(new AuthHandler());
        this.add(new CrossTypeHandler(model));
    }
}

export default CrossTypeReviewValidator;
