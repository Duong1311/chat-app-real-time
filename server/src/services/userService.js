import * as bcrypt from "bcrypt";
import User from "../models/userModel";

const loginService = (email, password) => {
  console.log("loginService", email, password);
  // if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
  //   res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
  //   return
  // }

  // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
};

const registerService = async (data) => {
  console.log("register", data);
  const { email, password, userName } = data;

  try {
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

export const userService = {
  loginService,
  registerService,
};
