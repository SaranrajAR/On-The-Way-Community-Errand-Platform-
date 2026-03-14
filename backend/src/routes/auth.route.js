import express from "express";
import { signup,login,logout,updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arcjectProtections } from "../middleware/arcjet.middleware.js";
const router= express.Router();
import User from "../model/User.js";

router.use(arcjectProtections)
router.get("/test",(req,res)=>{
    res.status(200).json({message: "Arcjet protection passed!"});
});
router.post("/signup",signup);

router.post("/login",login);

router.get("/logout",logout);

router.put("/update-profile", protectedRoute, updateProfile);

router.get("/check", protectedRoute, (req, res) => {
    res.status(200).json( req.user );
});

router.post("/save-fcm-token",protectedRoute, async (req,res) => {

   const { token } = req.body;

   await User.findByIdAndUpdate(req.user._id,{
       fcmToken: token
   });

   res.sendStatus(200);
});
export default router;
