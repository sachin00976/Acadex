import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Notification from "../models/notificationSchema.js";
import { Chat } from "../models/chatSchema.js";

export const createNotification = async (chatId, message, sender) => {
  try {
    const chat = await Chat.findById(chatId).populate("users.user");

    if (!chat) {
      console.error("Chat not found for notification creation");
      return;
    }

    // Create a notification for each recipient in the chat
    const notifications = chat.users.map(async (chatUser) => {
      // Don't create a notification for the person who sent the message
      if (chatUser.user._id.toString() === sender._id.toString()) {
        return null;
      }

      await Notification.create({
        sender: sender._id,
        senderModel: sender.role,
        recipient: chatUser.user._id,
        recipientModel: chatUser.user.role,
        chat: chatId,
        message: message._id,
      });
    });

    await Promise.all(notifications);

  } catch (error) {
    console.error("Error creating notification:", error);
  }
};



export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id, isRead: false })
    .populate("sender", "firstName middleName lastName profile")
    .populate({
        path: "chat",
        select: "chatName isGroupChat users"
    })
    .populate("message", "content") 
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});



export const markNotificationsAsRead = asyncHandler(async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
        throw new ApiError(400, "Chat ID is required");
    }

    await Notification.updateMany(
        { recipient: req.user._id, chat: chatId, isRead: false },
        { $set: { isRead: true } }
    );

    return res.status(200).json(new ApiResponse(200, {}, "Notifications marked as read"));
});