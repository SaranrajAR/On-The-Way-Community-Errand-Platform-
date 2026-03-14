import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import rideRoutes from "./routes/ride.routes.js"



import {server,app} from "./lib/socket.js";

app.use(cookieParser());
dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({origin:process.env.CLIENT_URL, credentials:true}));


const PORT=process.env.PORT || 3000;

app.use("/api/auth",authRoutes);
app.use("/api/ride",rideRoutes);



server.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
    connectDB(process.env.MONGODB_URL);
});