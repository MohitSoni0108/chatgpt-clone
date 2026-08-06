import { Router } from "express";

import  authenticateUser  from "../middleware/auth.middleware.js";
import { createChat , getChats , getSingleChat} from "../controllers/chat.controller.js";

const router = Router();

// Protected Route
router.post("/", authenticateUser, createChat);
router.get("/", authenticateUser, getChats);
router.get("/:chatId", authenticateUser, getSingleChat);

export default router;