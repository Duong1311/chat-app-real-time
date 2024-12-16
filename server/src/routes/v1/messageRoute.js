import express from "express";
import { messageController } from "~/controllers/messageController";
import { authMiddleware } from "~/middlewares/authMiddleware";
const Router = express.Router();

Router.route("/").get(
  authMiddleware.isAuthorized,
  messageController.allMessages
);
Router.route("/").post(
  authMiddleware.isAuthorized,
  messageController.sendMessage
);
export const messageRoute = Router;
