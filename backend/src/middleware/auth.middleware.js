import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { ENV } from "../lib/env.js";

export const protectedRoute =async (req,res,next) => {
    try {
        const token =req.cookies.jwt
        if(!token) return res.status(401).json({message:"Unauthorized, No token provided"});
        const decoded =jwt.verify(token,ENV.JWT_SECRET);

        if(!decoded) return res.status(401).json({message:"Unathorized, Invalid Toekn"});

        const user=await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});

        req.user=user;

        next();
    } catch (error) {
        console.log("Error in protectedRoute");
        res.status(500).json({message:"Internal Server Error"});
    }
}
