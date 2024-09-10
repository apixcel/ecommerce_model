import mongoose, { model } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_number: { type: String, required: true, unique: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: { type: Number, required: true },
    discount_amount: { type: Number, required: true },
    gross_amount: { type: Number, required: true },
    shipping_amount: { type: Number, required: true },
    net_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "processing", "shipping", "delivered"],
      default: "placed",
    },
    payment_status: {
      type: String,
      enum: ["paid", "not paid"],
      default: "not paid",
    },
    payment_type: {
      type: String,
      enum: ["netbanking", "upi", "cod"],
      required: true,
    },
    payment_transaction_id: { type: String },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

export default Order;
