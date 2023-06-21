import hashPassword from "../utils/hash.js";
import { genToken } from "../utils/token.js";

const signup = async (model, type, email, password) => {
    var passwordHash = hashPassword(password);
    var uuid = await model.signup(email, passwordHash);
    const token = genToken(uuid, type);
    return {
        id: uuid,
        token: token,
    };
};

export default signup;
