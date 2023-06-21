import bcrypt from "bcrypt";
import { genToken } from "../utils/token.js";
import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";

const login = async (model, type, email, password) => {
    const entity = await model.getByEmail(email);
    if (!bcrypt.compareSync(password, entity.password)) {
        throw new CustomError(EnumError.PERMISSION_DENIED, "Password incorrect");
    }
    const token = genToken(entity._id, type);
    return {
        id: entity._id,
        token: token,
    };
};
export default login;
