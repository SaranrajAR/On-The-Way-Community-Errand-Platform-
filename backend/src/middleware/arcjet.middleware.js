import aj from "../lib/arcjet.js";
import {isSpoofedBot} from "@arcjet/inspect";

export const arcjectProtections =async (req,res,next) => {
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Too Many Requests - Rate limit exceeded"});
            }
            else if(decision.reason.isBot()){
                return res.status(403).json({message: "Forbidden - Bot detected"});
            }
            else{
                return res.status(403).json({message: "Forbidden - Request denied"});
            }
        }
        //check for spoofed bot
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                message: "Forbidden - Spoofed bot detected",
                error: "Spoofed Bot",

            });
        }

        next();
    } catch (error) {
        console.log("Arcjet middleware error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}