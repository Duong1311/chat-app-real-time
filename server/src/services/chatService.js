import Chat from "~/models/chatModel";
// tao chat moi hoac lay chat cu
const accessChat = async (data) => {
  const { userId } = data;
  if (!userId) {
    return { message: "Không có userId" };
  }
  const isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        userIds: { $elemMatch: { $eq: data.user._id } },
      },
      {
        userIds: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("userIds", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "senderId",
        select: "-password",
      },
    });
  // console.log(isChat);
  if (isChat.length === 0) {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      userIds: [data.user._id, userId],
    };

    const newChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: newChat._id }).populate(
      "userIds",
      "-password"
    );

    return FullChat;
  }

  return isChat;
};
//lay tat ca cac chat cua user
const fetchChat = async (data) => {
  const { userId } = data;
  if (!userId) {
    return { message: "Không có userId" };
  }
  const allChat = await Chat.find({
    userIds: { $elemMatch: { $eq: userId } },
  })
    .populate("userIds", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "senderId",
        select: "-password",
      },
    })
    .sort({ updatedAt: -1 });

  return allChat;
};

const createGroup = async (data) => {
  // console.log(data);
  if (!data.users) {
    return { message: "Không có users" };
  }
  if (!data.chatName) {
    return { message: "Không có tên nhóm chat" };
  }

  if (data.users.length < 2) {
    return { message: "More than 2 users are required to form a group chat" };
  }
  //push user tao group chat vao mang users
  const users = [...data.users, data.user];

  const groupChat = await Chat.create({
    chatName: data.chatName,
    userIds: users,
    isGroupChat: true,
    groupAdmin: data.user,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("userIds", "-password")
    .populate("groupAdmin", "-password");

  return fullGroupChat;
};

const renameGroup = async (data) => {
  const { chatId, chatName } = data;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("userIds", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    throw new Error("Chat Not Found");
  } else {
    return updatedChat;
  }
};

const removeFromGroup = async (data) => {
  const { chatId, userId } = data;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("userIds", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    throw new Error("Chat Not Found");
  } else {
    return removed;
  }
};

const addToGroup = async (data) => {
  const { chatId, userId } = data;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("userIds", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    throw new Error("Chat Not Found");
  } else {
    return added;
  }
};

export const chatService = {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
