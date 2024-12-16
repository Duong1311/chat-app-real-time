import express from "express";
import { chatController } from "~/controllers/chatController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/").post(chatController.accessChat);
Router.route("/").get(chatController.fetchChat);

Router.route("/group").post(
  // authMiddleware.isAuthorized,
  chatController.createGroup
);
Router.route("/rename").put(
  authMiddleware.isAuthorized,
  chatController.renameGroup
);
Router.route("/groupremove").put(
  authMiddleware.isAuthorized,
  chatController.removeFromGroup
);
Router.route("/groupadd").put(
  authMiddleware.isAuthorized,
  chatController.addToGroup
);

export const chatRoute = Router;
