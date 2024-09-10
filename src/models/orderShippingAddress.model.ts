import mongoose, { model } from "mongoose";

const orderShippingAddressSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shipping_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingAddress",
      required: true,
    },
    full_address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip_code: { type: String, required: true },
  },
  { timestamps: true }
);
const OrderShippingAddresses = model(
  "OrderShippingAddress",
  orderShippingAddressSchema
);

export default OrderShippingAddresses;
