import mongoose, { model } from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    full_address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip_code: { type: String, required: true },
  },
  { timestamps: true }
);

const ShippingAddress = model("shippingAddressSchema", shippingAddressSchema);

export default ShippingAddress;
