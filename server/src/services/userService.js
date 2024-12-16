import * as bcrypt from "bcrypt";
import User from "../models/userModel";
// import { JwtProvider } from "~/providers/JwtProvider";

// const loginService = async (email, password) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     return { message: "Email chưa dược đăng ký!" };
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return { message: "Mật khẩu sai!" };
//   }

//   const accessToken = await JwtProvider.generateToken(
//     { email: user.email, userId: user._id },
//     process.env.ACCESS_TOKEN_SECRET_KEY,
//     process.env.ACCESS_TOKEN_LIFE
//   );
//   const refreshToken = await JwtProvider.generateToken(
//     { email: user.email, userId: user._id },
//     process.env.REFRESH_TOKEN_SECRET_KEY,
//     process.env.REFRESH_TOKEN_LIFE
//   );

//   //cookie

//   // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client

//   return { message: "Đăng nhập thành công!" };
// };

const registerService = async (data) => {
  try {
    // console.log("register", data);
    const { email, password, userName } = data;
    //check email exist
    const user = await User.findOne({ email });
    if (user) {
      return { message: "Email đã được đăng ký!" };
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await new User({
      email: email,
      password: hash,
      userName: userName,
    });
    await newUser.save();

    return { message: "Đăng ký thành công!" };
  } catch (error) {
    console.error(error);
    return { message: "Đăng ký thất bại!" };
  }
};
const getUserService = async (data) => {
  // get _id, email, userName
  const page = parseInt(data.page) || 1;
  const limit = parseInt(data.limit) || 10;
  const skip = (page - 1) * limit;
  const mathQuery = {};
  // index search by userName or email
  if (data.search) {
    mathQuery.$text = { $search: data.search };
  }
  const totalUser = await User.countDocuments(mathQuery);
  const totalPage = Math.ceil(totalUser / limit);
  const users = await User.find(mathQuery)
    .select("_id email userName")
    .limit(limit)
    .skip(skip);

  return {
    users,
    totalPage,
    currentPage: page,
  };
};

export const userService = {
  // loginService,
  registerService,
  getUserService,
};
