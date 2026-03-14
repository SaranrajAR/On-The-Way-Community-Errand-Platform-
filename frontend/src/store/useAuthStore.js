import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import notificationSound from "../assets/notification.mp3";
import notification_recive from "../assets/notification-recive.mp3";
import { sendBrowserNotification } from "../lib/sendBrowserNotification .js"
const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : import.meta.env.VITE_deployed_URL1; // Remove /api for socket connection
import { requestNotificationPermission } from '../lib/fcm.js';

const notification = new Audio(notificationSound);
notification.volume = 0.7;
const notificationRecive = new Audio(notification_recive);
notificationRecive.volume = 0.7;

// This lives outside the store or in a utility file
const syncFCMToken = async () => {
    try {
        // 1. Get the token from your fcm.js logic
        const token = await requestNotificationPermission(); 
        
        if (token) {
            // 2. Save it to the database
            await axiosInstance.post("/auth/save-fcm-token", { token });
            console.log("FCM Token synced successfully");
            
            // 3. RETURN it so the caller (like login) can see it
            return token; 
        }
    } catch (error) {
        console.error("FCM Sync Error:", error);
    }
    return null; // Return null if it failed or was denied
};


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    socket: null,
    isCreatedRide: false,
    pendingRides: null,
    isBooking: false,
    bookedDriver: null,
    assignedPassenger: null,
    optedRide: null,
    isConnecting: false,




    // checkAuth: async () => {
    //     try {
    //         const res = await axiosInstance.get('/auth/check');
    //         set({ authUser: res.data })
    //     } catch (error) {
    //         console.log("Error checking auth:", error);
    //         toast.error("Error checking authentication. Please try again.");
    //     }
    //     finally {
    //         set({ isCheckingAuth: false });
    //     }
    // },
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();
            const token = await syncFCMToken(); // Get the token from the sync function
            if (token) {
                await axiosInstance.post("/auth/save-fcm-token", { token });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // User just not logged in — normal
                set({ authUser: null });
            } else {
                console.log("Auth check error:", error);
                toast.error("Server error. Try again.");
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            get().connectSocket();
            toast.success("Signup successful!");
        } catch (error) {
            console.log("Signup error full:", error.response?.data);
            toast.error(error.response?.data?.message || "Signup failed");
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            get().connectSocket();
            requestNotificationPermission();
            toast.success("Login successful!");
            const token = await syncFCMToken(); // Get the token from the sync function
            if (token) {
                await axiosInstance.post("/auth/save-fcm-token", { token });
            }
        } catch (error) {
            console.log("Login error full:", error.response?.data);
            toast.error(error.response?.data?.message || "Login failed");
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout");
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error in Logging Out");
            console.log("Error in logout", error);
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile Pic Updated Succesfully");
        } catch (error) {
            toast.error("Error in Update Profile");
            console.log("Error in updateProfile", error);
        }
    },

    connectSocket: () => {
        const { authUser, socket, isConnecting } = get();

        // 1. Guards
        if (!authUser || socket?.connected || isConnecting) return;

        // Set connecting flag to true immediately
        set({ isConnecting: true });

        const newSocket = io(baseURL, {
            withCredentials: true,
            // Optional: reduce reconnection attempts if server is flaky
            reconnectionAttempts: 5,
        });
        set({ socket: newSocket });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            set({ isConnecting: false }); // Done connecting
        });

        newSocket.on("connect_error", (err) => {
            console.log("Socket connect error:", err.message);
            set({ isConnecting: false });
        });

        // 2. Clear & Register Listeners
        // We use .off().on() pattern to ensure a clean slate
        newSocket.off("newRide").on("newRide", (ride) => {
            const { authUser: currentUser } = get();
            if (ride.user._id === currentUser?._id) return;

            notification.play().catch(e => console.log("Audio play blocked"));
            // sendBrowserNotification(
            //     "🚗 New Ride Available",
            //     `${ride.user.fullName} created a ride`
            // );
            toast.success(
                `🚗 ${ride.user.fullName} created a ride`,
                { duration: 4000, position: "top-right" }
            );
        });

        newSocket.off("assignedUser").on("assignedUser", (data) => {
            set({ assignedPassenger: data.passenger });
            notificationRecive.play()
            sendBrowserNotification(
                "🎉 Ride Booked!",
                `${data.passenger.fullName} booked your ride`
            );

            toast.success(`🎉 ${data.passenger.fullName} booked your ride!`);
        });

        
    },


    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    createRide: async (data) => {
        try {
            const res = await axiosInstance.post("/ride/creatRide", data);
            toast.success("CreatedRide waiting for People");
            set({
                isCreatedRide: true,
                optedRide: res.data.ride// Adjust based on your API response structure
            });
        } catch (error) {
            toast.error("Error creatRide");
            console.log(error);
        }
    },

    getPendingRide: async () => {
        try {
            const res = await axiosInstance.get("/ride/getPendingRides");
            set({ pendingRides: res.data });
        } catch (error) {
            console.log(error);
        }
    },

    bookRide: async (rideId) => {


        try {
            set({ isBooking: true });

            const res = await axiosInstance.post(
                "/ride/bookRide",
                { rideId }
            );


            set({
                isBooking: false,
                bookedDriver: res.data.driver   // ✅ store driver here
            });

            toast.success("Ride booked successfully 🚗");

            return {
                success: true,
                driver: res.data.driver
            };

        } catch (error) {
            console.log("BOOKRIDE CATCH BLOCK");

            set({ isBooking: false });

            toast.error(
                error?.response?.data?.message ||
                "Failed to book ride"
            );

            return { success: false };
        }
    },

    getOptedRide: async () => {
        try {
            const res = await axiosInstance.get('/ride/getOptedRide');
            if (res.status === 200) {
                set({ optedRide: res.data });
                return true;
            }
            return false;

        } catch (error) {
            console.log(error);
            return false
        }
    },

    cancelRide:async(rideId)=>{
        try {
            console.log("Cancelling ride with ID:", rideId);
            const res=await axiosInstance.put(`/ride/cancelRide/${rideId}`);
            set({ optedRide: null, bookedDriver: null, isCreatedRide: false,assignedPassenger: null });
            toast.success("Ride cancelled successfully");
        } catch (error) {
            console.log("Error in cancelRide", error);
            toast.error("Failed to cancel ride");
        }
    }    












}))