import { Chat } from "../models/chat.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createChat = asyncHandler(async (req, res) => {
  // Create chat
  const chat = await Chat.create({
    owner: req.user._id,
    title: req.body.title || "New Chat",
  });

 

  // Success response
  return res
    .status(201)
    .json(new ApiResponse(201, chat, "Chat created successfully"));
});

export { createChat };