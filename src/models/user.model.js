import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//data
 const userSchema =  mongoose.Schema(
 {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshTokenHash: {
  type: String,
  default: null,
},

refreshTokenExpiresAt: {
  type: Date,
  default: null,
},
  },
 {
    timestamps: true,
  }
);

//method for the above data
userSchema.methods.generateAccessToken = function () {

    return jwt.sign(

        {
            id: this._id
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRY
        }

    );

};

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};


const User = mongoose.model("User", userSchema);




export default User;