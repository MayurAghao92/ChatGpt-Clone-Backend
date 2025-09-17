import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import dotenv from 'dotenv';
dotenv.config();
import setupSocketServer from "./src/sockets/socket.server.js";
import http from "http";

const httpServer=http.createServer(app);

setupSocketServer(httpServer);


connectDB();

httpServer.listen(5000, () => { 
    console.log("Server is running on port 5000");
})