import { Router } from "express";

import  authenticateUser  from "../middleware/auth.middleware.js";
import { createChat } from "../controllers/chat.controller.js";

const router = Router();

// Protected Route
router.post("/", authenticateUser, createChat);

export default router;