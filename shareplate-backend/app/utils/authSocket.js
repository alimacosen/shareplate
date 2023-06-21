import jwt from "jsonwebtoken";
import { EnumError } from "../../constants/enum.js";
import CustomError from "../../constants/errors.js";

const verifyAuthSocket = (socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
        const data = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
        socket.id = data.id;
        socket.type = data.type;
        socket.join(data.id);
        socket.to(data.id).emit("auth", "Hello from server");
        next();
    } else {
        throw new CustomError(EnumError.UNAUTHENTICATED);
    }
};

export default verifyAuthSocket;
