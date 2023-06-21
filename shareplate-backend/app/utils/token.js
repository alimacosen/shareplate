import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { EnumError } from "../../constants/enum.js";
dotenv.config();

const genToken = (id, type) => {
    const token = jwt.sign({ id: id, type: type }, process.env.JWT_SECRET, {
        expiresIn: "365d",
    });
    return token;
};

export { genToken };
