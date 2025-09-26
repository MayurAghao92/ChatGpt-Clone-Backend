import { Server } from "socket.io";
import cookie from "cookie";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import generateAIResponse from "../services/ai.service.js";
import messageModel from "../models/messages.model.js";

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication error:No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error:Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("ai-message", async (messsagePayload) => {

      await messageModel.create({
        user: socket.user._id,
        chat: messsagePayload.chat,
        content: messsagePayload.message,
        role: "user",
      });

      const chatHistory = (
        await messageModel
          .find({
            chat: messsagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).reverse();

      const response = await generateAIResponse(
        chatHistory.map(msg => {
          return {
            role: msg.role,
            parts: [{ text: msg.content }],
          };
        })
      );

      await messageModel.create({
        user: socket.user._id,
        chat: messsagePayload.chat,
        content: response,
        role: "model",
      });

      socket.emit("ai-response", {
        content: response,
        chat: messsagePayload.chat,
      });
    });
  });
}

export default setupSocketServer;
