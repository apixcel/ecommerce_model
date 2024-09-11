import crypto from "crypto";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorhandler";
import sendMessage from "../utils/sendMessage";
import { sendToken } from "../utils/sendToken";

// Register User
export const registerUser = catchAsyncError(async (req, res, next) => {
  console.log("body", req.body);

  const user = await User.create(req.body);

  sendToken(user, 201, res);
});

// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 201, res);
});

// Logout User
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Details
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user?.id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const resetPasswordUrl = `https://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  // const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

  try {
    await sendMessage(
      user.email,
      "resetYour password",

      `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Memes canvas</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`
    );

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error: any) {
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  // create hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid reset password token", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Update Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user?.id).select("+password");
  if (!user)
    return res.send({ message: "user not found", data: null, success: false });

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Invalid", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update User Profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const { body } = req;

  const bodyObj: { [key: string]: any } = body.toObject() || {};
  [
    "status",
    "email",
    "role",
    "resetPasswordToken",
    "resetPasswordExpire",
  ].forEach((key) => delete bodyObj[key]);

  await User.findByIdAndUpdate(req.user?.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// ADMIN DASHBOARD

// Get All Users --ADMIN
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User Details --ADMIN
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role --ADMIN
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete Role --ADMIN
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  await User.findByIdAndDelete(user._id);

  res.status(200).json({
    success: true,
  });
});
