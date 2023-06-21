import ValidatorBuilder from "./validatorBuilder.js";
import ProfileDataHandler from "./handlers/profileDataHandler.js";

class EmailPasswordValidator extends ValidatorBuilder {
    constructor() {
        super();
        this.add(new ProfileDataHandler());
    }
}

export default EmailPasswordValidator;
