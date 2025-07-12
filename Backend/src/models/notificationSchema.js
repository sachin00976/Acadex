import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel"
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Admin", "Faculty", "Student"]
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel"
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["Admin", "Faculty", "Student"]
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    isRead: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);