import mongoose from "mongoose";

const { Schema } = mongoose;

const rideSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    mode: {
      type: String,
      enum: ["bike", "car"],
      required: true,
    },

    passengers: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    leaveInMinutes: {
      type: Number,
      required: true,
    },
    place:{
      type:String,
      required:true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    assignedUser:{
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
