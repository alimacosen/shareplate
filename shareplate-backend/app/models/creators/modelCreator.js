import { EnumError, EnumType } from "../../../constants/enum.js";
import CustomError from "../../../constants/errors.js";
class ModelCreator {
    constructor() {
        return;
    }

    createModel = () => {
        throw new CustomError(EnumError.UNIMLEMENTED);
    };
}

export default ModelCreator;
