import mongoose from "mongoose";


export const connectDB=async (mongoURL)=>{
    try {
        await mongoose.connect(mongoURL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}