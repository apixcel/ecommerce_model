"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getSingleUser = exports.getAllUsers = exports.updateProfile = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.getUserDetails = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const cloud_1 = __importDefault(require("../config/cloud"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const sendMessage_1 = __importDefault(require("../utils/sendMessage"));
const sendToken_1 = require("../utils/sendToken");
// Register User
exports.registerUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const myCloud = yield cloud_1.default.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, gender, password } = req.body;
    const user = yield user_model_1.default.create({
        name,
        email,
        gender,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });
    (0, sendToken_1.sendToken)(user, 201, res);
}));
// Login User
exports.loginUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorhandler_1.default("Please Enter Email And Password", 400));
    }
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorhandler_1.default("Invalid Email or Password", 401));
    }
    const isPasswordMatched = yield user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new errorhandler_1.default("Invalid Email or Password", 401));
    }
    (0, sendToken_1.sendToken)(user, 201, res);
}));
// Logout User
exports.logoutUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
}));
// Get User Details
exports.getUserDetails = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).json({
        success: true,
        user,
    });
}));
// Forgot Password
exports.forgotPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorhandler_1.default("User Not Found", 404));
    }
    const resetToken = yield user.getResetPasswordToken();
    yield user.save({ validateBeforeSave: false });
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const resetPasswordUrl = `https://${req.get("host")}/password/reset/${resetToken}`;
    // const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;
    try {
        yield (0, sendMessage_1.default)(user.email, "resetYour password", `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
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
  </div>`);
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    }
    catch (error) {
        yield user.save({ validateBeforeSave: false });
        return next(new errorhandler_1.default(error.message, 500));
    }
}));
// Reset Password
exports.resetPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // create hash token
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield user_model_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new errorhandler_1.default("Invalid reset password token", 404));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    (0, sendToken_1.sendToken)(user, 200, res);
}));
// Update Password
exports.updatePassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("+password");
    if (!user)
        return res.send({ message: "user not found", data: null, success: false });
    const isPasswordMatched = yield user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new errorhandler_1.default("Old Password is Invalid", 400));
    }
    user.password = req.body.newPassword;
    yield user.save();
    (0, sendToken_1.sendToken)(user, 201, res);
}));
// Update User Profile
exports.updateProfile = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    const { body } = req;
    const bodyObj = body.toObject() || {};
    [
        "status",
        "email",
        "role",
        "resetPasswordToken",
        "resetPasswordExpire",
    ].forEach((key) => delete bodyObj[key]);
    yield user_model_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
    });
}));
// ADMIN DASHBOARD
// Get All Users --ADMIN
exports.getAllUsers = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    res.status(200).json({
        success: true,
        users,
    });
}));
// Get Single User Details --ADMIN
exports.getSingleUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id);
    if (!user) {
        return next(new errorhandler_1.default(`User doesn't exist with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
}));
// Update User Role --ADMIN
exports.updateUserRole = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        role: req.body.role,
    };
    yield user_model_1.default.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
}));
// Delete Role --ADMIN
exports.deleteUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id);
    if (!user) {
        return next(new errorhandler_1.default(`User doesn't exist with id: ${req.params.id}`, 404));
    }
    yield user_model_1.default.findByIdAndDelete(user._id);
    res.status(200).json({
        success: true,
    });
}));
