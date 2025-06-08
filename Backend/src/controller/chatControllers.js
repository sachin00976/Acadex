import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chatSchema.js";
import { ObjectId } from "mongodb";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    throw new ApiError(404, "UserId or role is missing!");
  }

  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const currentUser = {
    user: new ObjectId(req.user._id),
    userModel: req.user.role,
  };

  const otherUser = {
    user: new ObjectId(userId),
    userModel: role,
  };

  let chatRes = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { user: currentUser.user, userModel: currentUser.userModel } } },
      { users: { $elemMatch: { user: otherUser.user, userModel: otherUser.userModel } } },
    ],
  })
    .populate("users.user", "-password -refreshToken")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "-password -refreshToken",
      },
    });
    
  if (!chatRes) {
   
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [currentUser, otherUser],
    };
    
    const createdChat = await Chat.create(chatData);
    
    chatRes = await Chat.findById(createdChat._id)
      .populate("users.user", "-password -refreshToken")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password -refreshToken",
        },
      });
  }
  
  if (!chatRes) {
    throw new ApiError(500, "Internal server error occurred while fetching chat!");
  }

  return res.status(200).json(new ApiResponse(200, chatRes, "Chat fetched successfully"));
});


const fetchChat = asyncHandler(async (req, res) => {
  const userId = new ObjectId(req.user._id);
  
  const userRole = req.user.role;
  
  const chatRes = await Chat.find({
    users: {
      $elemMatch: {
        user: userId,
        userModel: userRole
      }
    }
  })
    .populate("users.user", "-password -refreshToken")
    .populate("admin", "-password -refreshToken")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "-password -refreshToken"
      }
    })
    .sort({ updatedAt: -1 });
    
  return res
    .status(200)
    .json(new ApiResponse(200, chatRes, "Chat fetched successfully"));
});


const createGroupChat = asyncHandler(async (req, res) => {
  let {  name } = req.body;
  
  const filePath=req.file?.path;
  const fileType=req.file?.mimetype;
  if(!filePath || !name)
  {
    throw new ApiError(400,"Group profile and name is required")
  }
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if(!allowedFormats.includes(fileType))
  {
    throw new ApiError(400,"Invalid file type!")
  }
  
  const users=[];
  const currentUser = {
    user: new ObjectId(req.user._id), 
    userModel: req.user.role,
  };

  users.push(currentUser);
  const uploadResponse=await uploadOnCloudinary(filePath);
  const createdGroup = await Chat.create({
    chatName: name,
    users: users,
    isGroupChat: true,
    admin: currentUser.user,
    adminModel: currentUser.userModel,
    profile: {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url,
        }
  });

  const groupChatRes = await Chat.findById(createdGroup._id)
    .populate("users.user", "-password -refreshToken")
    .populate("admin", "-password -refreshToken");

  if (!groupChatRes) {
    throw new ApiError(500, "Error occurred while creating group");
  }

  return res.status(200).json(
    new ApiResponse(200, groupChatRes, "Group created successfully")
  );
});

const editGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
 

  if (!chatId) {
    throw new ApiError("chatId required!");
  }

  const { name } = req.body;

  if (!name) {
    throw new ApiError("Group Name is required");
  }

  let chatRes = await Chat.findById(chatId);

  if (!chatRes) {
    throw new ApiError("Chat not found!");
  }

  if (!chatRes.admin.equals(req.user._id)) {
    throw new ApiError(403, "Only admin can modify group name!");
  }

  const update = {
    chatName: name,
  };

  if (req.file) {
    const filepath = req.file.path;
    const fileType = req.file?.mimetype;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(fileType)) {
      throw new ApiError(400, "Invalid file type!");
    }

    if (chatRes.profile?.public_id) {
      await deleteOnCloudinary(chatRes.profile.public_id);
    }

    const uploadResponse = await uploadOnCloudinary(filepath); // ✅ FIXED

    update.profile = {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  }

  chatRes = await Chat.findByIdAndUpdate(chatId, update, {
    new: true,
  })
    .populate("users.user", "-password -refreshToken")
    .populate("admin", "-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, chatRes, "Group updated successfully"));
});


const removeFromGroup = asyncHandler(async (req, res) => {
  var { chatId, memberToRemove } = req.body;
  console.log(memberToRemove)
  if(memberToRemove && typeof memberToRemove==="string")
  {
    memberToRemove=JSON.parse(memberToRemove)
  }
  if (!chatId || !memberToRemove?.user || !memberToRemove?.userModel) {
    throw new ApiError(400, "chatId and user required!");
  }
  
  const userId = {
    user: new ObjectId(memberToRemove.user),
    userModel: memberToRemove.userModel,
  };

  let chatRes = await Chat.findById(chatId);
  if (!chatRes) {
    throw new ApiError(404, "Chat not found");
  }

  if (!chatRes.admin.equals(req.user._id)) {
    throw new ApiError(403, "Only admin can add or remove member");
  }
  
  chatRes = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users.user", "-password -refreshToken")
    .populate("admin", "-password -refreshToken")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "-password -refreshToken",
      },
    });

  return res
    .status(200)
    .json(new ApiResponse(200, chatRes, "Member removed successfully"));
});

const addToGroup = asyncHandler(async (req, res) => {
  let { chatId, membersToAdd } = req.body;

  
  if (membersToAdd && typeof membersToAdd === "string") {
    try {
      membersToAdd = JSON.parse(membersToAdd);
    } catch (e) {
      throw new ApiError(400, "Invalid JSON format for membersToAdd");
    }
  }


  if (!chatId || !Array.isArray(membersToAdd) || membersToAdd.length === 0) {
    throw new ApiError(400, "chatId and a valid membersToAdd array are required!");
  }


  const usersToAdd = membersToAdd.map((member) => {
    if (!member.user || !member.userModel) {
      throw new ApiError(400, "Each member must have user and userModel fields");
    }
    return {
      user: new ObjectId(member.user),
      userModel: member.userModel,
    };
  });

  
  let chatRes = await Chat.findById(chatId);
  if (!chatRes) {
    throw new ApiError(404, "Chat not found");
  }

  // Ensure only admin can add
  if (!chatRes.admin.equals(req.user._id)) {
    throw new ApiError(403, "Only admin can add or remove members");
  }

  // Filter out users who are already in the group
  const existingUsers = chatRes.users.map((u) => ({
    user: u.user.toString(),
    userModel: u.userModel,
  }));

  const filteredUsersToAdd = usersToAdd.filter(
    (newUser) =>
      !existingUsers.some(
        (existing) =>
          existing.user === newUser.user.toString() &&
          existing.userModel === newUser.userModel
      )
  );

  
  if (filteredUsersToAdd.length === 0) {
    chatRes = await Chat.findById(chatId)
      .populate("users.user", "-password -refreshToken")
      .populate("admin", "-password -refreshToken")
      .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "-password -refreshToken",
      },
    });
    

    return res
      .status(200)
      .json(new ApiResponse(200, chatRes, "All members already exist in the group"));
  }

 
  chatRes = await Chat.findByIdAndUpdate(
    chatId,
    { $addToSet: { users: { $each: filteredUsersToAdd } } },
    { new: true }
  )
    .populate("users.user", "-password -refreshToken")
    .populate("admin", "-password -refreshToken")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "-password -refreshToken",
      },
    });
  
  return res
    .status(200)
    .json(new ApiResponse(200, chatRes, "New members added successfully"));
});

const leaveGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    throw new ApiError(400, "chatId is required!");
  }

  const memberId = {
    user: new ObjectId(req.user._id),
    userModel: req.user.role,
  };

  let chatRes = await Chat.findById(chatId);
  if (!chatRes) {
    throw new ApiError(404, "Chat not found");
  }

  const isAdmin = chatRes.admin.equals(memberId.user);

  
  chatRes = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: memberId } },
    { new: true }
  );

  if (!chatRes) {
    throw new ApiError(500, "Error occurred while leaving");
  }


  if (isAdmin && chatRes.users.length > 0) {
    const randomUser = chatRes.users[0];
    await Chat.findByIdAndUpdate(chatId, {
      admin: randomUser.user,
      adminModel: randomUser.userModel,
    });
  }

  
  if (chatRes.users.length === 0) {
    await Chat.findByIdAndDelete(chatId);
    return res.status(200).json(new ApiResponse(200, null, "Group deleted. Member left the Group successfully."));
  }

  
  const updatedChat = await Chat.findById(chatId)
    

  return res.status(200).json(new ApiResponse(200, updatedChat, "Member left the Group successfully."));
});






export { accessChat,
  createGroupChat,
editGroup,
addToGroup ,
fetchChat,
leaveGroup,
removeFromGroup

};
