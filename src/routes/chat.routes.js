import { Router } from "express";

import  authenticateUser  from "../middleware/auth.middleware.js";
import { createChat , getChats , getSingleChat,renameChat ,deleteChat} from "../controllers/chat.controller.js";

const router = Router();

// Protected Route
router.post("/", authenticateUser, createChat);
router.get("/", authenticateUser, getChats);
router.get("/:chatId", authenticateUser, getSingleChat);
router.patch("/:chatId", authenticateUser, renameChat);
router.delete("/:chatId", authenticateUser, deleteChat);

export default router;