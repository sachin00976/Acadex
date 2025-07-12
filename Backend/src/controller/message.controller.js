import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/messageSchema.js"
import { ObjectId } from "mongodb";
import { populate } from "dotenv";
import { Chat } from "../models/chatSchema.js";
import Notification from "../models/notificationSchema.js";

const allMessage = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId
    var message = await Message.find({ chat: new ObjectId(chatId) })
        .populate("sender", "firstName middleName lastName profile email role")
        .populate("chat")

    return res.status(200).json(
        new ApiResponse(200, message, "Message fetched successfully")
    )

})

const sendMessage=asyncHandler(async (req,res)=>{
    const {content,chatId}=req.body;

    if (!content || !chatId) {
        throw new ApiError(400, "Content and chatid required!")
    }
    var newMessage = {
        sender: req.user._id,
        senderModel: req.user.role,
        content: content,
        chat: chatId
    }
    var message = await Message.create(newMessage)
    message = await Message.findOne(message._id)
        .populate("sender", "firstName middleName lastName profile email role")
        .populate({
            path: "chat",
            populate: {
                path: "users.user",
                select: "-password -refreshToken"
            }
        })
        .sort({ createdAt: -1 })
    const recipients = message.chat.users.filter(
        (u) => u.user._id.toString() !== req.user._id.toString()
    );

    await Promise.all(
        recipients.map((r) =>
            Notification.create({
                sender: req.user._id,
                senderModel: req.user.role,
                recipient: r.user._id,
                recipientModel: r.userModel,
                chat: message.chat._id,
                message: message._id
            })
        )
    );
    await Chat.findByIdAndUpdate(
        chatId,
        {
            latestMessage: message._id
        }
    )

    return res.status(200).json(
        new ApiResponse(200, message, "message send successfully")
    )



})

const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.body.messageId;
  //console.log("msgid:",messageId)
  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }

  const messageRes = await Message.findById(messageId);
  if (!messageRes) {
    throw new ApiError(404, "No message was found");
  }

  if (!messageRes.sender._id.equals(req.user._id)) {
    throw new ApiError(403, "Only the sender can delete the message");
  }

  await Message.findByIdAndDelete(messageId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Message was deleted successfully")
  );
});


export {allMessage,sendMessage,deleteMessage}