import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
    type: String,
    
    trim: true,
    maxlength: 100,
}
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema);