// Author: TrungQuanDev: https://youtube.com/@trungquandev
import express from "express";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

// API đăng ký.
Router.route("/register").post(userController.register);

// API đăng nhập.
Router.route("/login").post(userController.login);

// API đăng xuất.
Router.route("/logout").delete(userController.logout);

// API Refresh Token - Cấp lại Access Token mới.
Router.route("/refresh_token").put(userController.refreshToken);
// API lấy thông tin người dùng.
Router.route("/search").get(
  authMiddleware.isAuthorized,
  userController.getUser
);

export const userRoute = Router;
