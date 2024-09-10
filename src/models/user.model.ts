import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  role_id: mongoose.Schema.Types.ObjectId;
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  status: "active" | "inactive" | "blocked";
}

const userSchema: Schema<IUser> = new Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
      required: true,
    },
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
