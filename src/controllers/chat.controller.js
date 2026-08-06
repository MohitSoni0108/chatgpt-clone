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

const getChats = asyncHandler(async (req, res) => {

    const chats = await Chat
        .find({
            owner: req.user._id,
        })
        .sort({
            updatedAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            chats,
            "Chats retrieved successfully"
        )
    );

});

 const getSingleChat = asyncHandler(async (req, res) => {

    const { chatId } = req.params;

    const chat = await Chat.findOne({
        _id: chatId,
        owner: req.user._id,
    });

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            chat,
            "Chat retrieved successfully"
        )
    );

});


export { createChat  , getChats, getSingleChat };