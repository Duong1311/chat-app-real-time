import Message from "~/models/messageModel";
import Chat from "~/models/chatModel";

const allMessages = async (data) => {
  // console.log(data);
  const messages = Message.find({ chatId: data.chatId }).populate(
    "senderId",
    " _id userName email"
  );
  return messages;
};
// input content, chatId, _id
const sendMessage = async (data) => {
  const { content, chatId } = data;

  if (!content || !chatId) {
    return { message: "Content and chatId are required" };
  }
  // create new message
  var newMessage = {
    senderId: data._id,
    content: content,
    chatId: chatId,
  };

  const message = await Message.create(newMessage);

  // populate senderId and chatId
  const messagePopulate = await Message.findById({ _id: message._id })
    .populate("senderId", " _id userName email")
    .populate("chatId", " _id userIds");

  // update chat last message on Chat model
  await Chat.findByIdAndUpdate({ _id: chatId }, { latestMessage: message._id });

  return messagePopulate;
};
export const messageService = { allMessages, sendMessage };
