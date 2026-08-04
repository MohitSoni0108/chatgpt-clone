import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Authenticate Logged In User

const authenticateUser = asyncHandler(async (req, res, next) => {

  // Read token from cookie

  const token = req.cookies?.token;

  // Cookie missing

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  // Verify JWT

  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  // Find User

  const user = await User.findById(decodedToken.id);

  // User deleted

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Attach user

  req.user = user;

  // Continue request

  next();

});

export default authenticateUser;