importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  // firebase configs
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  // Use payload.data because that's where you put the info in your Node.js code
  const notificationTitle = payload.data.title || "New Update";
  
  const notificationOptions = {
    body: payload.data.body || "Check the app for details",
    icon: "/icon-192.png",
    tag: 'ride-alert', // This ensures new rides replace old ones instead of stacking
    data: {
      url: "https://community-errand-platform.vercel.app/notification" // You can add a URL to open when clicked
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});