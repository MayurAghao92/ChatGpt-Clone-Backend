import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  validateSessionController,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", authMiddleware, logoutController);
router.get("/validate", authMiddleware, validateSessionController);

export default router;
