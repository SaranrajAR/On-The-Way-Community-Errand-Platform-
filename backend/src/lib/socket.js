import {Server} from 'socket.io';
import http from 'http';
import express from "express";
import {ENV} from '../lib/env.js';
import { socketMiddleware } from '../middleware/socket.auth.middleware.js';



const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:[ENV.CLIENT_URL],
        credentials:true
    }
});

io.use(socketMiddleware);

//online users map

const userSocketMap={};

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.user.fullName} with socket ID: ${socket.id}`);
    userSocketMap[socket.userId]=socket.id;
    
    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.user.fullName} with socket ID: ${socket.id}`);
        delete userSocketMap[socket.userId];
    });
});

export {io,server,app,userSocketMap}
    
    