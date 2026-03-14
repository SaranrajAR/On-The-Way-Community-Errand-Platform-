import Ride from "../model/Ride.js";
import { io, userSocketMap } from "../lib/socket.js";
import admin from '../firebaseAdmin.js';
import User from "../model/User.js";
async function sendNotification(tokens, title, body) {

   if (!tokens || tokens.length === 0) {
    console.log("No FCM tokens available");
    return;
  }
  const message = {
    data: {
      title,
      body
    },
    tokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("FCM notifications sent:", response.successCount);
  } catch (error) {
    console.log("FCM error:", error);
  }
}

export const createRide = async (req, res) => {
  try {
    const { location, mode, passengers, leaveInMinutes, place } = req.body;
    const ride = await Ride.create({
      user: req.user._id,
      lat: location.lat,
      lng: location.lng,
      mode,
      passengers,
      leaveInMinutes,
      place
    });

    const populatedRide = await Ride.findById(ride._id)
      .populate("user", "fullName mobile profilePic")
      .sort({ createdAt: -1 }); // newest first (optional)



    // 🔥 Emit to all online users
    io.emit("newRide", populatedRide);

    // =============================
    // 🔔 SEND PUSH NOTIFICATION
    // =============================

    // Get all users except ride creator
    const users = await User.find({
      _id: { $ne: req.user._id },
      fcmToken: { $exists: true, $ne: null }
    }).select("fcmToken");

    const tokens = users.map(user => user.fcmToken);

    await sendNotification(
      tokens,
      "🚗 New Ride Available",
      `${req.user.fullName} created a ride`
    );

    res.status(201).json({
      ride: populatedRide
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getPendingRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "pending",
      user: { $ne: req.user._id }  // ❗ Exclude logged-in user
    })
      .populate("user", "fullName mobile profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookRide = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "pending"
      },
      {
        status: "confirmed",
        assignedUser: req.user._id
      },
      { new: true }
    ).populate("user", "fullName mobile email");

    if (!ride) {
      return res.status(400).json({
        message: "Driver already assigned to someone else Or Ride is Cancelled"
      });
    }

    // 🔥 Get driver's socket ID
    const driverId = ride.user._id.toString();
    const driverSocketId = userSocketMap[driverId];

    if (driverSocketId) {
      io.to(driverSocketId).emit("assignedUser", {
        passenger: {
          fullName: req.user.fullName,
          mobile: req.user.mobile,
          email: req.user.email
        }
      });
    }

    res.status(200).json({
      message: "Ride booked successfully",
      driver: ride.user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOptedRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({ user: req.user, status: "pending" });
    if (!ride) return res.status(400).json({ message: "No rides Opted allow to book the new ride" });
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const cancelRide=async (req,res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId)
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = "cancelled";
    await ride.save();

    res.status(200).json({ message: "Ride status Cancelled successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

