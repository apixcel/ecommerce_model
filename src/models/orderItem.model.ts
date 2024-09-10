import mongoose, { model } from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: false,
    },
    product_name: { type: String, required: true },
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total_amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderItem = model("OrderItem", orderItemSchema);

export default OrderItem;
