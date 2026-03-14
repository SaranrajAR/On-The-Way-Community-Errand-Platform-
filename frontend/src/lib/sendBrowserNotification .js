export const sendBrowserNotification = (title, body) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: "/icon-192.png", // optional icon
        });
    }
};