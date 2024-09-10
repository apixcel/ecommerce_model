import mongoose, { model } from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    coupon_code: { type: String, required: true, unique: true },
    discount_type: { type: String, enum: ["fixed", "rate"], required: true },
    discount_value: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Offer = model("Offer", offerSchema);

export default Offer;
