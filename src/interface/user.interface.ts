import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
  role_id: mongoose.Schema.Types.ObjectId;
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  status: "active" | "inactive" | "blocked";
  resetPasswordToken?: string;
  resetPasswordExpire?: string | Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(enteredPassword: string): Promise<boolean>;
  getJWTToken(): string;
  getResetPasswordToken(): Promise<string>;
}
