# 🚀 On the Way

**On the Way** is a real-time ride sharing Progressive Web App (PWA) designed for **apartment communities**.  
It helps residents coordinate rides with neighbors who are heading to the same destination, reducing traffic, saving fuel, and encouraging community collaboration.

Instead of booking a ride like traditional ride-hailing apps, **drivers broadcast their rides and riders can join if they are heading the same way.**

---

## 💡 Concept

Think of it like **Rapido — but reversed.**

- In **Rapido**, a user requests a ride and a driver is assigned.
- In **On the Way**, a **driver broadcasts a ride** and riders can **join the ride** if they are heading in the same direction.

This approach works especially well in **large apartment communities** where many residents travel to similar locations at the same time.

---

## ✨ Features

- 🚗 **Ride Broadcasting**  
  Drivers can post rides with destination, transport mode, and departure time.

- ⚡ **Real-Time Updates**  
  Ride events are instantly broadcast to other users using **Socket.io**.

- 🔔 **Push Notifications**  
  Users receive real-time notifications using **Firebase Cloud Messaging (FCM)**.

- 🗺 **Interactive Maps**  
  Location selection powered by **Leaflet.js** open-source maps.

- 👤 **Profile Image Uploads**  
  Secure profile image uploads via **Cloudinary**.

- 🔐 **Secure Authentication**  
  User authentication and session handling using **JWT**.

- 📱 **Progressive Web App (PWA)**  
  Installable mobile-like experience directly from the browser.

---

## 🧠 How It Works

1. A user planning to travel posts a **ride broadcast**.
2. Ride details are emitted in **real time** to other residents.
3. Interested users **opt into the ride**.
4. Once accepted, both users get connected.

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Leaflet.js
- Service Workers (PWA)
- Zustand

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io

### Services
- Firebase Cloud Messaging (Push Notifications)
- Cloudinary (Image Uploads)

### Authentication
- JWT (JSON Web Tokens)

---

## 🏗 Architecture

The current version follows a **monolithic architecture**, where a single backend server handles:

- API requests
- Real-time events
- ride coordination
- authentication

While simple and reliable for early-stage deployment, the system could be scaled further using:

- Microservices
- Event queues
- Distributed WebSocket servers

---

## ☁️ Deployment

| Component | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB |

---

## 📸 Screenshots

