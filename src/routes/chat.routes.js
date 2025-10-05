import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createChat,
  getChat,
  getMessages,
  deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChat);
router.get("/messages/:id", authMiddleware, getMessages);
router.delete("/:id", authMiddleware, deleteChat);

export default router;
