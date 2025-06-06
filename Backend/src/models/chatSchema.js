import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    profile: {
    public_id: { type: String, 
        required:true,
    },
    url: { type: String, 
        required:true,
    },
  },
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "users.userModel",
        },
        userModel: {
          type: String,
          required: true,
          enum: ["Admin", "Faculty", "Student"],
        },
      },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    
    admin: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "adminModel",
    },
    adminModel: {
    type: String,
    enum: ["Admin", "Faculty", "Student"],
    },
    
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);

