import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arcjectProtections } from "../middleware/arcjet.middleware.js";
import { createRide ,getPendingRides,bookRide,getOptedRide,cancelRide} from "../controllers/ride.controller.js";
const router= express.Router();

router.use(arcjectProtections)

router.post('/creatRide',protectedRoute,createRide)
router.get('/getPendingRides',protectedRoute,getPendingRides);
router.post('/bookRide',protectedRoute,bookRide)
router.get('/getOptedRide',protectedRoute,getOptedRide);
router.put('/cancelRide/:rideId',protectedRoute,cancelRide); // ✅ new route for updating ride status

export default router;