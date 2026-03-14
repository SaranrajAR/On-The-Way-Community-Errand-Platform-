import User from '../model/User.js';
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const signup=async (req,res)=>{
    const {fullName,mobile,email,password}=req.body;

    try {
        if(!fullName || !mobile || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        
        }
        const user =await User.findOne({email});
        if(user){
            return res.status(409).json({message:"User with this email already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            fullName,
            mobile,
            email,
            password:hashedPassword,
        });

        const savedUser=await newUser.save();
        const resUser=await User.findById(savedUser._id).select("-password");

        const token=generateToken(savedUser._id,res);
        res.status(201).json(resUser);
        
    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message});
    }

}
export const login =async (req,res) => {
    const {email,password}=req.body;

    try {
        const user=await User.findOne({email:email});
        if(!user) return res.status(400).json({message:"User not found"});
        
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"});

        generateToken(user._id,res);

        const resUser=await User.findById(user._id).select("-password");
        res.status(200).json(resUser);
    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message});
    }

}

export const logout = (_, res) => {
    res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true,
        // These MUST match your generateToken settings:
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: "LoggedOut Successfully" });
};

export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        if(!profilePic) return res.status(400).json({message:"profile Pic is requires"});
        const userId =req.user._id;
        const uploadRes=await cloudinary.uploader.upload(profilePic);

        const updatedUser=await User.findByIdAndUpdate(userId,{
            profilePic:uploadRes.secure_url,
        },{new:true});

        const resUser=await User.findById(updatedUser._id).select("-password");
        res.status(200).json(resUser);

    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
