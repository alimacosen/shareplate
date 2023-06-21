import bcrypt from "bcrypt";

const hashPassword = (password) => {
    const saltRound = 10;
    var passwordHash = bcrypt.hashSync(password, saltRound);
    return passwordHash;
};

export default hashPassword;
