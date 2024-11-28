// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";
import { JwtProvider } from "~/providers/JwtProvider";
import User from "~/models/userModel";
import bcrypt from "bcrypt";
import ms from "ms";

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email chưa dược đăng ký!" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Mật khẩu sai!" });
    }

    const accessToken = await JwtProvider.generateToken(
      { email: user.email, userId: user._id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      process.env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      { email: user.email, userId: user._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_LIFE
    );

    //cookie
    // res.cookie("accessToken", accessToken, {
    //   sameSite: "strict",
    //   secure: true,
    //   maxAge: ms(process.env.COOKIE_LIFE),
    //   httpOnly: true,
    // });
    res.cookie("refreshToken", refreshToken, {
      sameSite: "strict",
      secure: true,
      maxAge: ms(process.env.COOKIE_LIFE),
      httpOnly: true,
    });
    const { email, _id } = user;

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client

    res.status(StatusCodes.OK).json({ email, id: _id, accessToken });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const register = async (req, res) => {
  try {
    const result = await userService.registerService(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    // Do something
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ message: "Logout API success!" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    // Do something
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Refresh Token không hợp lệ!",
      });
    }
    const decoded = await JwtProvider.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const accessToken = await JwtProvider.generateToken(
      { email: decoded.email, userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      process.env.ACCESS_TOKEN_LIFE
    );
    const newRefreshToken = await JwtProvider.generateToken(
      { email: decoded.email, userId: decoded.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_LIFE
    );
    res.cookie("refreshToken", newRefreshToken, {
      sameSite: "strict",
      secure: true,
      maxAge: ms(process.env.COOKIE_LIFE),
      httpOnly: true,
    });
    res.status(StatusCodes.OK).json({ accessToken });

    // res.status(StatusCodes.OK).json({ message: " Refresh Token API success." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: " Refresh Token API failed." });
  }
};

export const userController = {
  login,
  logout,
  refreshToken,
  register,
};
