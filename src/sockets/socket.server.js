import { Server } from "socket.io";
import cookie from 'cookie';
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';

function setupSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use((socket, next) => {
        const cookies=cookie.parse(socket.handshake.headers?.cookie ||'');

        if(!cookies.token){
            next(new Error("Authentication error:No token provided"));
        }

        try{
            const decoded=jwt.verify(cookies.token,process.env.JWT_SECRET);
            const user=userModel.findById(decoded.id);
            socket.user=user;
            next();
        }catch(err){
            next(new Error("Authentication error:Invalid token"));
        }

    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });

        socket.on("ai-message", (messsagePayload) => {
            console.log("Message received:", messsagePayload);
        });
    });
}


export default setupSocketServer;