import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BJC0x-J_AGjmqs0V8UWZxEwbHbUZY3PLnvrHZf1gecxK8ITjFBDlSXdKw0N3CRVNTWIX5DvusVT_4suW_v45GYM"
    });

    return token;

  } catch (error) {
    console.log("FCM error", error);
  }
};