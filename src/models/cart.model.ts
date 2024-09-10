import mongoose, { Document, Schema } from "mongoose";

interface ICart extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  product_id?: mongoose.Schema.Types.ObjectId;
  product_variant_id?: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

const cartSchema: Schema<ICart> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    product_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);

export default CartModel;
