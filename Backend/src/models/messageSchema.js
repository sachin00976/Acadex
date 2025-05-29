import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Admin", "Faculty", "Student"],
    },
    content: { 
        type: String, trim: true 
    },
    chat: {
         type: mongoose.Schema.Types.ObjectId,
          ref: "Chat" 
        },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "readBy.userModel",
        },
        userModel: {
          type: String,
          enum: ["Admin", "Faculty", "Student"],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

