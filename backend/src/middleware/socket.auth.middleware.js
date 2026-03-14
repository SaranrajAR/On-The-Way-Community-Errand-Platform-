// import jwt from "jsonwebtoken";
// import User from "../model/User.js";
// import { ENV } from "../lib/env.js";

import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { ENV } from "../lib/env.js";



export const socketMiddleware = async (socket, next) => {
    try {

        const cookieHeader = socket.handshake.headers.cookie;

        if (!cookieHeader) {
            return next(new Error("No cookies found"));
        }

        const token = cookieHeader
            .split(";")
            .find(c => c.trim().startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("No JWT token"));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET); 

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated for ${user.fullName}`);

        next();

    } catch (error) {
        console.log("Socket auth error:", error.message);
        return next(new Error("Authentication error"));
    }
};
