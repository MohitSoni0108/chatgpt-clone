import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import { signupSchema , loginSchema } from "../validators/auth.validator.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import cookieOptions from "../constants/cookieOptions.js";

import {generateAccessToken,generateRefreshToken,hashRefreshToken,} from "../utils/token.js";

import { accessCookieOptions,refreshCookieOptions,} from "../constants/cookieOptions.js";



export const signup = asyncHandler(async (req, res) => {

  const validatedData = signupSchema.parse(req.body);

  const { name, email, password } = validatedData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user.name , user.email, "User Registered Successfully"));
});

export const login = asyncHandler(async (req, res) => {

  // Validate request
  const validatedData = loginSchema.parse(req.body);

  const { email, password } = validatedData;

  // Find user
  const user = await User
    .findOne({ email })
    .select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  // Store hashed refresh token
  user.refreshTokenHash = hashRefreshToken(refreshToken);



  // Refresh token expiry
  user.refreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );


//first save the user and then put password undefined to hide it from the response
  await user.save();

    // Hide password
  user.password = undefined;
  
  return res
    .status(200)
    .cookie(
      "accessToken",
      accessToken,
      accessCookieOptions
    )
    .cookie(
      "refreshToken",
      refreshToken,
      refreshCookieOptions
    )
    .json(
      new ApiResponse(
        200,
        user,
        "Login successful"
      )
    );
});




// Logout Controller

export const logout = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);

  if (user) {
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;

    await user.save();
  }

  return res
    .status(200)
    .clearCookie(
      "accessToken",
      accessCookieOptions
    )
    .clearCookie(
      "refreshToken",
      refreshCookieOptions
    )
    .json(
      new ApiResponse(
        200,
        null,
        "Logout successful"
      )
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const hashedToken = hashRefreshToken(refreshToken);

  if (
    !user.refreshTokenHash ||
    user.refreshTokenHash !== hashedToken
  ) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (
    !user.refreshTokenExpiresAt ||
    user.refreshTokenExpiresAt < new Date()
  ) {
    throw new ApiError(401, "Refresh token expired");
  }

  // Rotate tokens
  const newAccessToken = generateAccessToken(
    user._id.toString()
  );

  const newRefreshToken = generateRefreshToken(
    user._id.toString()
  );

  // Store new refresh token hash
  user.refreshTokenHash = hashRefreshToken(
    newRefreshToken
  );

  user.refreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await user.save();

  return res
    .status(200)
    .cookie(
      "accessToken",
      newAccessToken,
      accessCookieOptions
    )
    .cookie(
      "refreshToken",
      newRefreshToken,
      refreshCookieOptions
    )
    .json(
      new ApiResponse(
        200,
        null,
        "Access token refreshed successfully"
      )
    );
});