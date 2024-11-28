// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from "http-status-codes";

const access = async (req, res) => {
  try {
    res.status(StatusCodes.OK).json({ ...req.jwtDecoded });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const dashboardController = {
  access,
};
