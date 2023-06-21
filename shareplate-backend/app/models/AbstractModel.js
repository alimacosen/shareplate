import { EnumError, EnumType } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";
class AbstractModel {
    constructor(DBs, mode) {
        this.DBs = DBs;
        this.setMode(mode);
    }

    setMode = (mode) => {
        this.mode = mode;
        this.model = this.DBs[this.mode];
    };

    getByEmail = async (email) => {
        var target = await this.model.findOne({ email: email }).catch((error) => {
            throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
        });
        return target;
    };

    getAll = async () => {
        var targets = await this.model
            .find()
            .select("-password")
            .catch((error) => {
                throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
            });
        return targets;
    };

    getById = async (id, toObj = true) => {
        throw new CustomError(EnumError.INTERNAL_SERVER_ERROR, "Not implemented");
    };

    saveTarget = async (target) => {
        return await target.save().catch((error) => {
            throw new CustomError(EnumError.INTERNAL_SERVER_ERROR);
        });
    };
}

export default AbstractModel;
