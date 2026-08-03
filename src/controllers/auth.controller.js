import bcrypt from "bcrypt";

import User from "../models/user.model.js";

import { signupSchema , loginSchema } from "../validators/auth.validator.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

    // Step 1 : Validate Request

    const validatedData = loginSchema.parse(req.body);

    // Step 2 : Extract Data

    const { email, password } = validatedData;

    // Step 3 : Find User

    const user = await User
        .findOne({ email })
        .select("+password");

    // Step 4 : User Not Found

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    // Step 5 : Compare Password

   const isPasswordCorrect = await user.comparePassword(password);

    // Step 6 : Password Incorrect

    if (!isPasswordCorrect) {

        throw new ApiError(
            401,
            "Invalid email or password"
        );

    }

    // Step 7 : Generate JWT

    const token = user.generateAccessToken();

    // Step 8 : Cookie Options

    const cookieOptions = {

        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000

    };

    // Step 9 : Hide Password

    user.password = undefined;

    // Step 10 : Send Cookie + Response

    return res

        .status(200)

        .cookie("token", token, cookieOptions)

        .json(

            new ApiResponse(

                200,

                user,

                "Login Successful"

            )

        );

});
