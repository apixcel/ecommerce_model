import { Response } from "express";
import { IUserDocument } from "../interface/user.interface";

export const sendToken = (
  user: IUserDocument,
  statusCode: number,
  res: Response
) => {
  const token = user.getJWTToken();
  const expire = Number(process.env.COOKIE_EXPIRE!);
  const options = {
    expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
