import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createChat } from '../controllers/chat.controller.js';
const router= express.Router();

router.post('/',authMiddleware,createChat)

export default router;