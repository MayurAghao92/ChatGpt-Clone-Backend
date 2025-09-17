import { Server } from "socket.io";

function setupSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
    });
}


export default setupSocketServer;