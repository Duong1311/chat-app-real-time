// Author: TrungQuanDev: https://youtube.com/@trungquandev
import JWT from "jsonwebtoken";

const generateToken = async (userInfor, secretKey, tokenlife) => {
  try {
    return JWT.sign(userInfor, secretKey, {
      algorithm: "HS256",
      expiresIn: tokenlife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = async (token, secretKey) => {
  try {
    //
    return JWT.verify(token, secretKey);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
