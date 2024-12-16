import { StatusCodes } from "http-status-codes";
import { chatService } from "~/services/chatService";

const accessChat = async (req, res, next) => {
  try {
    const result = await chatService.accessChat(req.body);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
    //     res
    //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //       .json({ errors: error.message });
  }
};
const fetchChat = async (req, res, next) => {
  try {
    const result = await chatService.fetchChat(req.query);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
  }
};
const createGroup = async (req, res, next) => {
  try {
    const result = await chatService.createGroup(req.body);
    res.status(StatusCodes.CREATED).json({ result, message: "Group Created" });
  } catch (error) {
    next(error);
  }
};
const renameGroup = async (req, res, next) => {
  try {
    const result = await chatService.renameGroup(req.body);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
  }
};
const removeFromGroup = async (req, res, next) => {
  try {
    const result = await chatService.removeFromGroup(req.body);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
  }
};
const addToGroup = async (req, res, next) => {
  try {
    const result = await chatService.addToGroup(req.body);
    res.status(StatusCodes.ACCEPTED).json({ result });
  } catch (error) {
    next(error);
  }
};

export const chatController = {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
