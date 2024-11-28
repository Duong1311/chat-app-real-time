// Author: TrungQuanDev: https://youtube.com/@trungquandev

import { StatusCodes } from "http-status-codes";
import { JwtProvider } from "~/providers/JwtProvider";

const isAuthorized = async (req, res, next) => {
  const authToken = req.headers.authorization;
  const accessToken = authToken?.split(" ")[1];
  //   console.log(accessToken);

  if (!accessToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized! (Token not found)" });
  }

  try {
    const decoded = await JwtProvider.verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    req.jwtDecoded = decoded;
    next();
  } catch (error) {
    // console.log(error);
    if (error.message?.includes("jwt expired")) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: "Unauthorized! (Token is expired, need refresh)" });
    }
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized! (Token is invalid)" });
  }
};

export const authMiddleware = { isAuthorized };
