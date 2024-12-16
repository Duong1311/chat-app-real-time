import { StatusCodes } from "http-status-codes";
import { messageService } from "~/services/messageService";

const allMessages = async (req, res, next) => {
  try {
    const result = await messageService.allMessages(req.query);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
  }
};
const sendMessage = async (req, res, next) => {
  try {
    const result = await messageService.sendMessage(req.body);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
  }
};

export const messageController = {
  allMessages,
  sendMessage,
};
