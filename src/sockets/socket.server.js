import { Server } from "socket.io";
import cookie from "cookie";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateAIResponse, generateVector } from "../services/ai.service.js";
import messageModel from "../models/messages.model.js";
import { queryMemory, createMemory } from "../services/vector.service.js";

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
      const requestMessage = await messageModel.create({
        user: socket.user._id,
        chat: messsagePayload.chat,
        content: messsagePayload.message,
        role: "user",
      });

      const requestVector = await generateVector(messsagePayload.message);

      const memory=await queryMemory({
       queryVector:requestVector,
        limit:3,
        metadata:{}
      })

      await createMemory({
        vectors:requestVector,
        messageId: requestMessage._id,
        metadata: {
          chat: messsagePayload.chat,
          user: socket.user._id,
          text:messsagePayload.message,
        },
      });

      
      console.log("Memory:",memory);

      const chatHistory = (
        await messageModel
          .find({
            chat: messsagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).reverse();

      const stm= chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        });

        const ltm=[
          {
            role:"system",
            
          }
        ]

      const response = await generateAIResponse( );

      const responseMessage=await messageModel.create({
        user: socket.user._id,
        chat: messsagePayload.chat,
        content: response,
        role: "model",
      });

      const responseVector=await generateVector(response);

      await createMemory({
        vectors:responseVector,
        messageId: responseMessage._id,
         metadata:{
          chat: messsagePayload.chat,
          user: socket.user._id,
          text:response,
        },
      })

      socket.emit("ai-response", {
        content: response,
        chat: messsagePayload.chat,
      });
    });
  });
}

export default setupSocketServer;
